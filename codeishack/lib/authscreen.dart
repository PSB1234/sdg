import 'package:flutter/material.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFF8FAFC),
              Color(0xFFE2E8F0),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),
                Text(
                  isLogin ? 'Welcome Back' : 'Create Account',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                    letterSpacing: -1,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  isLogin
                      ? 'Sign in to continue your journey'
                      : 'Join us to manage your finances',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 40),
                _buildForm(),
                const SizedBox(height: 32),
                _buildActionButtons(),
                const SizedBox(height: 24),
                _buildToggleAuth(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E293B).withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          if (!isLogin) ...[
            const TextField(
              decoration: InputDecoration(
                labelText: 'Full Name',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            const SizedBox(height: 16),
          ],
          const TextField(
            decoration: InputDecoration(
              labelText: 'Phone Number',
              prefixIcon: Icon(Icons.phone_outlined),
            ),
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 16),
          const TextField(
            decoration: InputDecoration(
              labelText: 'Email Address',
              prefixIcon: Icon(Icons.email_outlined),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
            icon: const Icon(Icons.sms_outlined),
            label: Text(isLogin ? 'Login with OTP' : 'Sign up with OTP'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366F1),
              foregroundColor: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
            icon: const Icon(Icons.lock_outline),
            label: Text(isLogin ? 'Login with Password' : 'Sign up with Password'),
          ),
        ),
      ],
    );
  }

  Widget _buildToggleAuth() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          isLogin ? "Don't have an account? " : "Already have an account? ",
          style: const TextStyle(color: Color(0xFF64748B)),
        ),
        TextButton(
          onPressed: () => setState(() => isLogin = !isLogin),
          child: Text(
            isLogin ? 'Sign up' : 'Login',
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              color: Color(0xFF6366F1),
            ),
          ),
        ),
      ],
    );
  }
}