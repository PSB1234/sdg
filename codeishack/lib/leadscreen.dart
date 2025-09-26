import 'package:flutter/material.dart';

import 'package:flutter/material.dart';

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

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final leads = [
      {
        'product': 'Home Loan',
        'status': 'Assigned',
        'priority': 'High',
        'amount': '₹25,00,000',
        'date': '15 Sep 2025',
        'icon': Icons.home_outlined,
      },
      {
        'product': 'Car Loan',
        'status': 'Under Review',
        'priority': 'Medium',
        'amount': '₹8,50,000',
        'date': '20 Sep 2025',
        'icon': Icons.directions_car_outlined,
      },
      {
        'product': 'Credit Card',
        'status': 'New',
        'priority': 'Low',
        'amount': '₹2,00,000',
        'date': '24 Sep 2025',
        'icon': Icons.credit_card_outlined,
      },
    ];

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
                        _buildStatItem('Active', '2', Icons.trending_up, const Color(0xFF4CAF50)),
                        _buildStatItem('Pending', '1', Icons.access_time, const Color(0xFFFF9800)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        
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
                            _getPriorityColor(lead['priority']!).withOpacity(0.2),
                            _getPriorityColor(lead['priority']!).withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        lead['icon'] as IconData,
                        color: _getPriorityColor(lead['priority']!),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            lead['product']!,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF2D3748),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            lead['amount']!,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: _getPriorityColor(lead['priority']!).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: _getPriorityColor(lead['priority']!).withOpacity(0.3),
                        ),
                      ),
                      child: Text(
                        lead['priority']!,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: _getPriorityColor(lead['priority']!),
                        ),
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
                        lead['date']!,
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

  Color _getPriorityColor(String priority) {
    return switch (priority) {
      'High' => const Color(0xFFEF4444),
      'Medium' => const Color(0xFFFF9800),
      _ => const Color(0xFF4CAF50),
    };
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