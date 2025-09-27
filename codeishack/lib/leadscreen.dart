import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://10.247.14.235:8080/api';

  static Future<String?> _getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }

  static Map<String, String> _getHeaders(String accessToken) {
    return {
      'Authorization': 'Bearer $accessToken',
      'Content-Type': 'application/json',
    };
  }

  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      final accessToken = await _getAccessToken();
      if (accessToken == null) {
        throw Exception('Access token not found');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile'),
        headers: _getHeaders(accessToken),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load profile: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching user profile: $e');
      return null;
    }
  }

  static Future<List<Map<String, dynamic>>> getLeads(String email) async {
    try {
      final accessToken = await _getAccessToken();
      if (accessToken == null) {
        throw Exception('Access token not found');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/customer/leads?email=$email'),
        headers: _getHeaders(accessToken),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);

        // Server response ke andar "leads" field hai
        final List<dynamic> leadsData = body['leads'] ?? [];

        return leadsData.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to load leads: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching leads: $e');
      return [];
    }
  }
}

class UserProfile {
  final String id;
  final String name;
  final String email;
  final int age;
  final List<String> roles;
  final bool isActive;
  final bool isEmailVerified;
  final int loginAttempts;
  final String createdAt;
  final String updatedAt;
  final List<String> permissions;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.age,
    required this.roles,
    required this.isActive,
    required this.isEmailVerified,
    required this.loginAttempts,
    required this.createdAt,
    required this.updatedAt,
    required this.permissions,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final user = json['user'];
    return UserProfile(
      id: user['_id'],
      name: user['name'],
      email: user['email'],
      age: user['age'],
      roles: List<String>.from(user['roles']),
      isActive: user['isActive'],
      isEmailVerified: user['isEmailVerified'],
      loginAttempts: user['loginAttempts'],
      createdAt: user['createdAt'],
      updatedAt: user['updatedAt'],
      permissions: List<String>.from(user['permissions']),
    );
  }
}

class TrackLeadsScreen extends StatefulWidget {
  const TrackLeadsScreen({super.key});

  @override
  State<TrackLeadsScreen> createState() => _TrackLeadsScreenState();
}

class _TrackLeadsScreenState extends State<TrackLeadsScreen>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  List<Map<String, dynamic>> leads = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    _fetchLeads();
    _controller.forward();
  }

  Future<void> _fetchLeads() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final profileData = await ApiService.getUserProfile();
      if (profileData != null) {
        final userProfile = UserProfile.fromJson(profileData);
        final fetchedLeads = await ApiService.getLeads(userProfile.email);
        if (fetchedLeads.isNotEmpty) {
          setState(() {
            leads = fetchedLeads.map((lead) {
              return {
                'leadId': lead['leadId'] ?? '',
                'customerName': lead['customerName'] ?? 'Unknown',
                'productType': lead['productType'] ?? 'Unknown Product',
                'status': lead['status'] ?? 'New',
                'priorityScore': lead['priorityScore'] ?? 0,
                'lastUpdated': lead['lastUpdated'] ?? DateTime.now().toString(),
                'trackingToken': lead['trackingToken'] ?? '',
                'icon': _getIconForProduct(lead['productType']),
              };
            }).toList();
            isLoading = false;
          });
        } else {
          setState(() {
            isLoading = false;
            errorMessage = 'No leads found for this user';
          });
        }
      } else {
        setState(() {
          isLoading = false;
          errorMessage = 'Failed to load user profile';
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = 'Error fetching data: $e';
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  IconData _getIconForProduct(String? product) {
    switch (product) {
      case 'Home Loan':
        return Icons.home_outlined;
      case 'Car Loan':
        return Icons.directions_car_outlined;
      case 'Credit Card':
        return Icons.credit_card_outlined;
      case 'Personal Loan':
        return Icons.person_outline;
      case 'Business Loan':
        return Icons.business_outlined;
      default:
        return Icons.info_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Count active leads (including 'New' status as active)
    int activeCount = leads.where((lead) =>
    lead['status'] == 'Assigned' || lead['status'] == 'New').length;
    int pendingCount = leads.where((lead) =>
    lead['status'] == 'Under Review').length;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Modern App Bar with gradient
            SliverAppBar(
              expandedHeight: 120,
              floating: false,
              pinned: true,
              elevation: 0,
              backgroundColor: Colors.transparent,
              flexibleSpace: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFF667eea),
                      Color(0xFF764ba2),
                    ],
                  ),
                ),
                child: FlexibleSpaceBar(
                  title: FadeTransition(
                    opacity: _fadeAnimation,
                    child: const Text(
                      'My Applications',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 24,
                      ),
                    ),
                  ),
                  centerTitle: false,
                  titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
                ),
              ),
              actions: [
                Container(
                  margin: const EdgeInsets.only(right: 16, top: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                    onPressed: () {},
                  ),
                ),
              ],
            ),

            // Stats Overview Card
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: SlideTransition(
                  position: _slideAnimation,
                  child: Container(
                    margin: const EdgeInsets.all(16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem('Total', '${leads.length}', Icons.apps, const Color(0xFF667eea)),
                        _buildStatItem('Active', '$activeCount', Icons.trending_up, const Color(0xFF4CAF50)),
                        _buildStatItem('Pending', '$pendingCount', Icons.access_time, const Color(0xFFFF9800)),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Loading or Error State
            if (isLoading)
              const SliverToBoxAdapter(
                child: Center(child: CircularProgressIndicator()),
              )
            else if (errorMessage != null)
              SliverToBoxAdapter(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ),
                ),
              )
            else
            // Applications List
              SliverList(
                delegate: SliverChildBuilderDelegate(
                      (context, index) {
                    return FadeTransition(
                      opacity: _fadeAnimation,
                      child: SlideTransition(
                        position: Tween<Offset>(
                          begin: Offset(0, 0.3 + (index * 0.1)),
                          end: Offset.zero,
                        ).animate(CurvedAnimation(
                          parent: _controller,
                          curve: Interval(
                            (index * 0.1).clamp(0.0, 1.0),
                            1.0,
                            curve: Curves.easeOut,
                          ),
                        )),
                        child: _buildLeadCard(context, leads[index], index),
                      ),
                    );
                  },
                  childCount: leads.length,
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: FadeTransition(
        opacity: _fadeAnimation,
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF667eea), Color(0xFF764ba2)],
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF667eea).withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: FloatingActionButton.extended(
            onPressed: () {},
            backgroundColor: Colors.transparent,
            elevation: 0,
            icon: const Icon(Icons.add, color: Colors.white),
            label: const Text(
              'New Application',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2D3748),
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildLeadCard(BuildContext context, Map<String, dynamic> lead, int index) {
    String formattedDate = '';
    try {
      DateTime dateTime = DateTime.parse(lead['lastUpdated']);
      formattedDate = '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    } catch (e) {
      formattedDate = 'N/A';
    }

    return Container(
      margin: EdgeInsets.fromLTRB(16, index == 0 ? 8 : 4, 16, 4),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        elevation: 0,
        shadowColor: Colors.black.withOpacity(0.05),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => Navigator.pushNamed(context, '/leadDetail'),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.grey.shade100,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            _getStatusColor(lead['status']!).withOpacity(0.2),
                            _getStatusColor(lead['status']!).withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        lead['icon'] as IconData,
                        color: _getStatusColor(lead['status']!),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            lead['productType']!,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF2D3748),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Priority Score: ${lead['priorityScore']}',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _getStatusIcon(lead['status']!),
                        size: 16,
                        color: _getStatusColor(lead['status']!),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        lead['status']!,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: _getStatusColor(lead['status']!),
                        ),
                      ),
                      const Spacer(),
                      Icon(
                        Icons.calendar_today_outlined,
                        size: 14,
                        color: Colors.grey.shade500,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        formattedDate,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    return switch (status) {
      'Assigned' => const Color(0xFF2196F3),
      'Under Review' => const Color(0xFFFF9800),
      'New' => const Color(0xFF4CAF50),
      _ => Colors.grey,
    };
  }

  IconData _getStatusIcon(String status) {
    return switch (status) {
      'Assigned' => Icons.assignment_ind_outlined,
      'Under Review' => Icons.rate_review_outlined,
      'New' => Icons.fiber_new_outlined,
      _ => Icons.info_outline,
    };
  }
}