import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isEditing = false;

  // Controllers for form fields
  final _nameController = TextEditingController(text: 'John Doe');
  final _phoneController = TextEditingController(text: '+91 98765 43210');
  final _emailController = TextEditingController(text: 'john.doe@email.com');
  final _addressController = TextEditingController(text: '123 Business District, Mumbai, Maharashtra 400001');
  final _designationController = TextEditingController(text: 'Senior Relationship Manager');
  final _employeeIdController = TextEditingController(text: 'EMP001');

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _designationController.dispose();
    _employeeIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('My Profile'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () => setState(() => _isEditing = !_isEditing),
            icon: Icon(_isEditing ? Icons.close : Icons.edit_outlined),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildProfileHeader(),
              const SizedBox(height: 24),
              _buildPersonalInfo(),
              const SizedBox(height: 24),
              _buildWorkInfo(),
              const SizedBox(height: 24),
              _buildAccountSettings(),
              const SizedBox(height: 24),
              _buildQuickActions(),
              const SizedBox(height: 32),
              if (_isEditing) _buildSaveButton() else _buildLogoutButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
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
        children: [
          Stack(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(40),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: const Icon(
                  Icons.person,
                  size: 40,
                  color: Colors.white,
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 12,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            _nameController.text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _designationController.text,
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.badge_outlined,
                  color: Colors.white,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Text(
                  'ID: ${_employeeIdController.text}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalInfo() {
    return _buildSection(
      'Personal Information',
      Icons.person_outline,
      [
        _buildFormField(
          controller: _nameController,
          label: 'Full Name',
          icon: Icons.person_outline,
          validator: (value) => value?.isEmpty == true ? 'Name is required' : null,
        ),
        const SizedBox(height: 16),
        _buildFormField(
          controller: _phoneController,
          label: 'Phone Number',
          icon: Icons.phone_outlined,
          keyboardType: TextInputType.phone,
          validator: (value) => value?.isEmpty == true ? 'Phone is required' : null,
        ),
        const SizedBox(height: 16),
        _buildFormField(
          controller: _emailController,
          label: 'Email Address',
          icon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value?.isEmpty == true) return 'Email is required';
            if (!value!.contains('@')) return 'Enter a valid email';
            return null;
          },
        ),
        const SizedBox(height: 16),
        _buildFormField(
          controller: _addressController,
          label: 'Address',
          icon: Icons.location_on_outlined,
          maxLines: 2,
        ),
      ],
    );
  }

  Widget _buildWorkInfo() {
    return _buildSection(
      'Work Information',
      Icons.work_outline,
      [
        _buildFormField(
          controller: _designationController,
          label: 'Designation',
          icon: Icons.business_center_outlined,
          validator: (value) => value?.isEmpty == true ? 'Designation is required' : null,
        ),
        const SizedBox(height: 16),
        _buildFormField(
          controller: _employeeIdController,
          label: 'Employee ID',
          icon: Icons.badge_outlined,
          enabled: false, // Employee ID should not be editable
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF0F9FF),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.2)),
          ),
          child: Row(
            children: [
              Icon(
                Icons.info_outline,
                color: const Color(0xFF06B6D4),
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Department: Sales & Marketing',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF0C4A6E),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Joined: January 2020',
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF0C4A6E),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAccountSettings() {
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
                Icons.settings_outlined,
                color: const Color(0xFF6366F1),
                size: 24,
              ),
              const SizedBox(width: 12),
              const Text(
                'Account Settings',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildSettingsTile(
            icon: Icons.security_outlined,
            title: 'Change Password',
            subtitle: 'Update your account password',
            onTap: () => _showChangePasswordDialog(),
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            icon: Icons.notifications_outlined,
            title: 'Notification Preferences',
            subtitle: 'Manage your notification settings',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Notification settings opened'),
                  backgroundColor: Color(0xFF6366F1),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildSettingsTile(
            icon: Icons.privacy_tip_outlined,
            title: 'Privacy Settings',
            subtitle: 'Control your data privacy',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Privacy settings opened'),
                  backgroundColor: Color(0xFF6366F1),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    final actions = [
      {
        'icon': Icons.help_outline,
        'title': 'Help & Support',
        'subtitle': 'Get help and support',
        'color': const Color(0xFF10B981),
        'onTap': () => Navigator.pushNamed(context, '/support'),
      },
      {
        'icon': Icons.feedback_outlined,
        'title': 'Send Feedback',
        'subtitle': 'Share your experience',
        'color': const Color(0xFF8B5CF6),
        'onTap': () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Feedback form opened'),
              backgroundColor: Color(0xFF8B5CF6),
            ),
          );
        },
      },
      {
        'icon': Icons.star_outline,
        'title': 'Rate Our App',
        'subtitle': 'Rate us on app store',
        'color': const Color(0xFFF59E0B),
        'onTap': () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Redirecting to app store...'),
              backgroundColor: Color(0xFFF59E0B),
            ),
          );
        },
      },
    ];

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
                Icons.flash_on_outlined,
                color: const Color(0xFF6366F1),
                size: 24,
              ),
              const SizedBox(width: 12),
              const Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...actions.map((action) => Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildSettingsTile(
              icon: action['icon'] as IconData,
              title: action['title'] as String,
              subtitle: action['subtitle'] as String,
              iconColor: action['color'] as Color,
              onTap: action['onTap'] as VoidCallback,
            ),
          )).toList(),
        ],
      ),
    );
  }

  Widget _buildSection(String title, IconData titleIcon, List<Widget> children) {
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
                titleIcon,
                color: const Color(0xFF6366F1),
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...children,
        ],
      ),
    );
  }

  Widget _buildFormField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
    int maxLines = 1,
    bool enabled = true,
  }) {
    return TextFormField(
      controller: controller,
      enabled: _isEditing && enabled,
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
      style: TextStyle(
        color: (_isEditing && enabled) ? const Color(0xFF1E293B) : const Color(0xFF64748B),
        fontSize: 16,
        fontWeight: FontWeight.w500,
      ),
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(
          icon,
          color: (_isEditing && enabled) ? const Color(0xFF6366F1) : const Color(0xFF94A3B8),
        ),
        filled: true,
        fillColor: (_isEditing && enabled) ? Colors.white : const Color(0xFFF8FAFC),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: (_isEditing && enabled) ? const Color(0xFFE2E8F0) : const Color(0xFFF1F5F9),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: (_isEditing && enabled) ? const Color(0xFFE2E8F0) : const Color(0xFFF1F5F9),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF6366F1), width: 2),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFF1F5F9)),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
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
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: (iconColor ?? const Color(0xFF6366F1)).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: iconColor ?? const Color(0xFF6366F1),
                size: 20,
              ),
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

  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {
          if (_formKey.currentState?.validate() == true) {
            setState(() => _isEditing = false);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Profile updated successfully'),
                backgroundColor: Color(0xFF10B981),
              ),
            );
          }
        },
        icon: const Icon(Icons.save_outlined),
        label: const Text('Save Changes'),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF6366F1),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => _showLogoutConfirmation(),
            icon: const Icon(Icons.logout_outlined),
            label: const Text('Logout'),
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFFDC2626),
              side: const BorderSide(color: Color(0xFFDC2626)),
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'App Version 1.0.0',
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF94A3B8),
          ),
        ),
      ],
    );
  }

  void _showChangePasswordDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Change Password'),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: InputDecoration(
                  labelText: 'Current Password',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
              ),
              SizedBox(height: 16),
              TextField(
                decoration: InputDecoration(
                  labelText: 'New Password',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
              ),
              SizedBox(height: 16),
              TextField(
                decoration: InputDecoration(
                  labelText: 'Confirm New Password',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
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
                    content: Text('Password updated successfully'),
                    backgroundColor: Color(0xFF10B981),
                  ),
                );
              },
              child: const Text('Update'),
            ),
          ],
        );
      },
    );
  }

  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Logout'),
          content: const Text('Are you sure you want to logout?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushNamedAndRemoveUntil(context, '/auth', (_) => false);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFDC2626),
                foregroundColor: Colors.white,
              ),
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }
}