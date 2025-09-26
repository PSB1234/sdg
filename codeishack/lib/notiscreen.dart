import 'package:flutter/material.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late List<AnimationController> _itemControllers;
  late List<Animation<double>> _itemAnimations;

  // Define notifications list here so we can access its length
  final List<Map<String, dynamic>> notifications = [
    {
      'title': 'Application Assigned',
      'message': 'Your Home Loan enquiry has been assigned to an officer.',
      'time': '2 hours ago',
      'type': 'success',
      'icon': Icons.assignment_ind_outlined,
      'isRead': false,
      'priority': 'High',
    },
    {
      'title': 'Officer Call Reminder',
      'message': 'Reminder: Bank officer will call you today between 2:00 PM - 5:00 PM',
      'time': '30 minutes ago',
      'type': 'warning',
      'icon': Icons.phone_callback_outlined,
      'isRead': false,
      'priority': 'High',
    },
    {
      'title': 'Documents Required',
      'message': 'We need additional information for your Credit Card application.',
      'time': '1 day ago',
      'type': 'info',
      'icon': Icons.description_outlined,
      'isRead': true,
      'priority': 'Medium',
    },
    {
      'title': 'Application Approved',
      'message': 'Congratulations! Your personal loan has been pre-approved.',
      'time': '2 days ago',
      'type': 'success',
      'icon': Icons.check_circle_outline,
      'isRead': true,
      'priority': 'High',
    },
    {
      'title': 'Payment Due',
      'message': 'Your EMI payment of ₹15,750 is due on 30th September.',
      'time': '3 days ago',
      'type': 'warning',
      'icon': Icons.payment_outlined,
      'isRead': true,
      'priority': 'Medium',
    },
    {
      'title': 'Welcome',
      'message': 'Welcome to our digital banking platform! Explore all features.',
      'time': '1 week ago',
      'type': 'info',
      'icon': Icons.celebration_outlined,
      'isRead': true,
      'priority': 'Low',
    },
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    // Create animation controllers based on actual notifications length
    _itemControllers = List.generate(notifications.length, (index) =>
        AnimationController(
          duration: Duration(milliseconds: 400 + (index * 100)),
          vsync: this,
        )
    );

    _itemAnimations = _itemControllers.map((controller) =>
        Tween<double>(begin: 0.0, end: 1.0).animate(
          CurvedAnimation(parent: controller, curve: Curves.elasticOut),
        )
    ).toList();

    _controller.forward();

    // Stagger item animations
    for (int i = 0; i < _itemControllers.length; i++) {
      Future.delayed(Duration(milliseconds: 200 + (i * 150)), () {
        if (mounted) {
          _itemControllers[i].forward();
        }
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    for (var controller in _itemControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    int unreadCount = notifications.where((n) => !(n['isRead'] as bool)).length;

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
                      'Notifications',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 24,
                      ),
                    ),
                  ),
                  centerTitle: false,
                  titlePadding: const EdgeInsets.only(left: 56, bottom: 16),
                ),
              ),
              leading: Container(
                margin: const EdgeInsets.only(left: 16, top: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
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
                    icon: const Icon(Icons.mark_email_read_outlined, color: Colors.white),
                    onPressed: () {},
                  ),
                ),
              ],
            ),
        
            // Notification Stats
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
                        _buildStatItem('Total', '${notifications.length}', Icons.notifications_outlined, const Color(0xFF667eea)),
                        _buildStatItem('Unread', '$unreadCount', Icons.mark_email_unread_outlined, const Color(0xFFEF4444)),
                        _buildStatItem('Important', '3', Icons.priority_high_outlined, const Color(0xFFFF9800)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        
            // Notifications List
            SliverList(
              delegate: SliverChildBuilderDelegate(
                    (context, index) {
                  if (index < notifications.length) {
                    return AnimatedBuilder(
                      animation: _itemAnimations[index],
                      builder: (context, child) {
                        // Clamp the animation value to ensure it's between 0.0 and 1.0
                        final animationValue = _itemAnimations[index].value.clamp(0.0, 1.0);
        
                        return Transform.scale(
                          scale: animationValue,
                          child: Opacity(
                            opacity: animationValue,
                            child: _buildNotificationCard(context, notifications[index], index),
                          ),
                        );
                      },
                    );
                  }
                  return null;
                },
                childCount: notifications.length,
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
          child: FloatingActionButton(
            onPressed: () {},
            backgroundColor: Colors.transparent,
            elevation: 0,
            child: const Icon(Icons.settings_outlined, color: Colors.white),
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

  Widget _buildNotificationCard(BuildContext context, Map<String, dynamic> notification, int index) {
    Color typeColor = _getNotificationColor(notification['type'] as String);
    Color priorityColor = _getPriorityColor(notification['priority'] as String);
    bool isRead = notification['isRead'] as bool;

    return Container(
      margin: EdgeInsets.fromLTRB(16, index == 0 ? 8 : 4, 16, 4),
      child: Material(
        color: isRead ? Colors.white : const Color(0xFFF8F9FF),
        borderRadius: BorderRadius.circular(16),
        elevation: 0,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => Navigator.pushNamed(context, '/leadDetail'),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isRead ? Colors.grey.shade100 : const Color(0xFF667eea).withOpacity(0.2),
                width: isRead ? 1 : 2,
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: typeColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        notification['icon'] as IconData,
                        color: typeColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  notification['title'] as String,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: isRead ? const Color(0xFF4A5568) : const Color(0xFF2D3748),
                                  ),
                                ),
                              ),
                              if (!isRead)
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF667eea),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(
                                Icons.access_time,
                                size: 14,
                                color: Colors.grey.shade500,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                notification['time'] as String,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: priorityColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  notification['priority'] as String,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: priorityColor,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  notification['message'] as String,
                  style: TextStyle(
                    fontSize: 14,
                    color: isRead ? Colors.grey.shade600 : const Color(0xFF2D3748),
                    height: 1.4,
                  ),
                ),
                if (notification['type'] == 'warning' && !isRead) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF3CD),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFFFE69C)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.priority_high, color: Color(0xFFFF9800), size: 16),
                        SizedBox(width: 8),
                        Text(
                          'Action Required',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFFF9800),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getNotificationColor(String type) {
    return switch (type) {
      'success' => const Color(0xFF4CAF50),
      'warning' => const Color(0xFFFF9800),
      'info' => const Color(0xFF2196F3),
      _ => const Color(0xFF667eea),
    };
  }

  Color _getPriorityColor(String priority) {
    return switch (priority) {
      'High' => const Color(0xFFEF4444),
      'Medium' => const Color(0xFFFF9800),
      _ => const Color(0xFF4CAF50),
    };
  }
}