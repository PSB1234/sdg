import 'package:flutter/material.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final faqs = [
      {
        'category': 'Applications',
        'icon': Icons.description_outlined,
        'color': const Color(0xFF6366F1),
        'q': 'How do I apply for a loan?',
        'a': 'You can apply for a loan by tapping "Create New Enquiry" on the home screen. Fill in your personal and financial details, select the loan type, and submit your application. Our team will review it within 24-48 hours.',
      },
      {
        'category': 'Applications',
        'icon': Icons.track_changes_outlined,
        'color': const Color(0xFF6366F1),
        'q': 'How can I track my application status?',
        'a': 'Go to "Track My Applications" from the home screen to see all your submitted applications. You can view detailed progress, timeline, and any pending requirements for each application.',
      },
      {
        'category': 'Account',
        'icon': Icons.person_outline,
        'color': const Color(0xFF8B5CF6),
        'q': 'How do I edit my profile information?',
        'a': 'Open your Profile from the home screen, tap the edit icon in the top-right corner, make your changes, and save. Some information like Employee ID cannot be changed for security reasons.',
      },
      {
        'category': 'Documents',
        'icon': Icons.folder_outlined,
        'color': const Color(0xFF06B6D4),
        'q': 'What documents do I need for loan application?',
        'a': 'Required documents vary by loan type but typically include: Identity proof (Aadhar/PAN), Address proof, Income proof (salary slips/ITR), Bank statements, and property documents for secured loans.',
      },
      {
        'category': 'Processing',
        'icon': Icons.schedule_outlined,
        'color': const Color(0xFF10B981),
        'q': 'How long does loan processing take?',
        'a': 'Processing time varies by loan type: Personal loans - 2-3 days, Home loans - 7-15 days, Business loans - 10-20 days. We\'ll keep you updated throughout the process.',
      },
      {
        'category': 'Eligibility',
        'icon': Icons.check_circle_outline,
        'color': const Color(0xFFF59E0B),
        'q': 'How do I check my loan eligibility?',
        'a': 'Your eligibility is automatically assessed based on your income, credit score, and other factors when you submit an application. You can also contact our support team for a pre-assessment.',
      },
      {
        'category': 'Interest Rates',
        'icon': Icons.percent_outlined,
        'color': const Color(0xFFEC4899),
        'q': 'What are the current interest rates?',
        'a': 'Interest rates vary by loan type and your profile. Home loans start from 8.5%, personal loans from 10.5%, and car loans from 7.5%. Final rates are determined after credit assessment.',
      },
      {
        'category': 'Repayment',
        'icon': Icons.payment_outlined,
        'color': const Color(0xFF06B6D4),
        'q': 'What are the repayment options?',
        'a': 'We offer flexible EMI options from 12 months to 30 years depending on the loan type. You can choose monthly, quarterly, or annual payment frequencies with auto-debit facility.',
      },
      {
        'category': 'Technical',
        'icon': Icons.help_outline,
        'color': const Color(0xFF64748B),
        'q': 'I\'m having trouble with the app. What should I do?',
        'a': 'Try restarting the app first. If the issue persists, clear the app cache or reinstall. For technical support, contact us through the support channels below with your device details.',
      },
    ];

    final filteredFaqs = faqs.where((faq) {
      final question = faq['q'] as String?;
      final answer = faq['a'] as String?;
      final category = faq['category'] as String?;

      return question?.toLowerCase().contains(_searchQuery.toLowerCase()) == true ||
          answer?.toLowerCase().contains(_searchQuery.toLowerCase()) == true ||
          category?.toLowerCase().contains(_searchQuery.toLowerCase()) == true;
    }).toList();

    final categories = faqs.map((faq) => faq['category'] as String).toSet().toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Help & Support'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () => _showContactOptions(context),
            icon: const Icon(Icons.headset_mic_outlined),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSupportHeader(),
            const SizedBox(height: 24),
            _buildSearchBar(),
            const SizedBox(height: 24),
            _buildQuickActions(),
            const SizedBox(height: 32),
            _buildFAQSection(filteredFaqs, categories),
            const SizedBox(height: 32),
            _buildContactSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildSupportHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF6366F1),
            Color(0xFF8B5CF6),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 8),
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
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.support_agent,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'We\'re Here to Help',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Find answers or get in touch',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: const Column(
                    children: [
                      Text(
                        '24/7',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        'Support Available',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: const Column(
                    children: [
                      Text(
                        '< 2h',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        'Response Time',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E293B).withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextField(
        controller: _searchController,
        onChanged: (value) => setState(() => _searchQuery = value),
        decoration: const InputDecoration(
          hintText: 'Search for help topics...',
          prefixIcon: Icon(Icons.search_outlined, color: Color(0xFF6366F1)),
          suffixIcon: Icon(Icons.mic_outlined, color: Color(0xFF94A3B8)),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    final quickActions = [
      {
        'title': 'Live Chat',
        'subtitle': 'Chat with support',
        'icon': Icons.chat_bubble_outline,
        'color': const Color(0xFF10B981),
        'onTap': () => _showLiveChat(),
      },
      {
        'title': 'Call Support',
        'subtitle': '1800-123-4567',
        'icon': Icons.phone_outlined,
        'color': const Color(0xFF6366F1),
        'onTap': () => _callSupport(),
      },
      {
        'title': 'Email Us',
        'subtitle': 'support@financeflow.com',
        'icon': Icons.email_outlined,
        'color': const Color(0xFF8B5CF6),
        'onTap': () => _emailSupport(),
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: Color(0xFF1E293B),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: quickActions.map((action) => Expanded(
            child: Padding(
              padding: EdgeInsets.only(
                right: action == quickActions.last ? 0 : 8,
                left: action == quickActions.first ? 0 : 8,
              ),
              child: GestureDetector(
                onTap: action['onTap'] as VoidCallback,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF1E293B).withOpacity(0.04),
                        blurRadius: 20,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: (action['color'] as Color).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          action['icon'] as IconData,
                          color: action['color'] as Color,
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        action['title'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1E293B),
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        action['subtitle'] as String,
                        style: const TextStyle(
                          fontSize: 10,
                          color: Color(0xFF64748B),
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          )).toList(),
        ),
      ],
    );
  }

  Widget _buildFAQSection(List<Map<String, dynamic>> filteredFaqs, List<String> categories) {
    if (_searchQuery.isNotEmpty) {
      return _buildSearchResults(filteredFaqs);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Frequently Asked Questions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: Color(0xFF1E293B),
          ),
        ),
        const SizedBox(height: 16),
        ...categories.map((category) {
          final categoryFaqs = filteredFaqs.where((faq) => faq['category'] == category).toList();
          return _buildCategorySection(category, categoryFaqs);
        }).toList(),
      ],
    );
  }

  Widget _buildCategorySection(String category, List<Map<String, dynamic>> faqs) {
    if (faqs.isEmpty) return const SizedBox.shrink();

    final categoryIcon = faqs.first['icon'] as IconData;
    final categoryColor = faqs.first['color'] as Color;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: categoryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                categoryIcon,
                color: categoryColor,
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                category,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: categoryColor,
                ),
              ),
            ],
          ),
        ),
        ...faqs.map((faq) => _buildFAQTile(faq)).toList(),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildSearchResults(List<Map<String, dynamic>> filteredFaqs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Search Results (${filteredFaqs.length})',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: Color(0xFF1E293B),
          ),
        ),
        const SizedBox(height: 16),
        if (filteredFaqs.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF1E293B).withOpacity(0.04),
                  blurRadius: 20,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(
                  Icons.search_off_outlined,
                  size: 48,
                  color: const Color(0xFF94A3B8),
                ),
                const SizedBox(height: 16),
                const Text(
                  'No results found',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Try different keywords or contact our support team',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFF94A3B8),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          )
        else
          ...filteredFaqs.map((faq) => _buildFAQTile(faq)).toList(),
      ],
    );
  }

  Widget _buildFAQTile(Map<String, dynamic> faq) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E293B).withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ExpansionTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: (faq['color'] as Color).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            faq['icon'] as IconData,
            color: faq['color'] as Color,
            size: 20,
          ),
        ),
        title: Text(
          faq['q'] as String,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1E293B),
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
            child: Text(
              faq['a'] as String,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF64748B),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E293B).withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.contact_support_outlined,
                color: const Color(0xFF6366F1),
                size: 24,
              ),
              const SizedBox(width: 12),
              const Text(
                'Still Need Help?',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Can\'t find what you\'re looking for? Our support team is ready to help you with any questions or issues.',
            style: TextStyle(
              fontSize: 14,
              color: Color(0xFF64748B),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _showContactOptions(context),
              icon: const Icon(Icons.headset_mic_outlined),
              label: const Text('Contact Support'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _reportIssue(),
                  icon: const Icon(Icons.bug_report_outlined),
                  label: const Text('Report Issue'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _requestCallback(),
                  icon: const Icon(Icons.schedule_outlined),
                  label: const Text('Request Callback'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showContactOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Contact Support',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildContactOption(
              icon: Icons.chat_bubble_outline,
              title: 'Live Chat',
              subtitle: 'Get instant help from our support team',
              color: const Color(0xFF10B981),
              onTap: () {
                Navigator.pop(context);
                _showLiveChat();
              },
            ),
            const SizedBox(height: 16),
            _buildContactOption(
              icon: Icons.phone_outlined,
              title: 'Phone Support',
              subtitle: '1800-123-4567 (Toll Free)',
              color: const Color(0xFF6366F1),
              onTap: () {
                Navigator.pop(context);
                _callSupport();
              },
            ),
            const SizedBox(height: 16),
            _buildContactOption(
              icon: Icons.email_outlined,
              title: 'Email Support',
              subtitle: 'support@financeflow.com',
              color: const Color(0xFF8B5CF6),
              onTap: () {
                Navigator.pop(context);
                _emailSupport();
              },
            ),
            const SizedBox(height: 16),
            _buildContactOption(
              icon: Icons.location_on_outlined,
              title: 'Visit Branch',
              subtitle: 'Find nearest branch location',
              color: const Color(0xFFF59E0B),
              onTap: () {
                Navigator.pop(context);
                _findBranch();
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildContactOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              color: Color(0xFF94A3B8),
              size: 16,
            ),
          ],
        ),
      ),
    );
  }

  void _showLiveChat() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening live chat...'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
  }

  void _callSupport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Calling support: 1800-123-4567'),
        backgroundColor: Color(0xFF6366F1),
      ),
    );
  }

  void _emailSupport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening email app...'),
        backgroundColor: Color(0xFF8B5CF6),
      ),
    );
  }

  void _findBranch() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening branch locator...'),
        backgroundColor: Color(0xFFF59E0B),
      ),
    );
  }

  void _reportIssue() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Report an Issue'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Issue Title',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Describe the issue',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Issue reported successfully'),
                  backgroundColor: Color(0xFF10B981),
                ),
              );
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  void _requestCallback() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Request Callback'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'Preferred Time',
                border: OutlineInputBorder(),
                suffixIcon: Icon(Icons.schedule),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Reason for callback',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Callback requested successfully'),
                  backgroundColor: Color(0xFF10B981),
                ),
              );
            },
            child: const Text('Request'),
          ),
        ],
      ),
    );
  }
}