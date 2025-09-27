import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CreateLeadScreen extends StatefulWidget {
  const CreateLeadScreen({super.key});

  @override
  State<CreateLeadScreen> createState() => _CreateLeadScreenState();
}

class _CreateLeadScreenState extends State<CreateLeadScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _amountController = TextEditingController();
  final _creditScoreController = TextEditingController();
  final _monthlyIncomeController = TextEditingController();
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();
  final _aadharController = TextEditingController();
  final _existingRelationshipController = TextEditingController();

  final products = ['Home Loan', 'Car Loan', 'Credit Card', 'Personal Loan', 'Business Loan'];
  String selectedProduct = 'Home Loan';
  bool isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _amountController.dispose();
    _creditScoreController.dispose();
    _monthlyIncomeController.dispose();
    _locationController.dispose();
    _notesController.dispose();
    _aadharController.dispose();
    _existingRelationshipController.dispose();
    super.dispose();
  }

  Future<void> submitLead() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      // Prepare the request body
      final Map<String, dynamic> requestBody = {
        "name": _nameController.text.trim(),
        "email": _emailController.text.trim(),
        "phoneNumber": _phoneController.text.trim(),
        "productType": selectedProduct,
        "address": _locationController.text.trim(),
        "existingRelationship": _existingRelationshipController.text.trim().isEmpty
            ? "None"
            : _existingRelationshipController.text.trim(),
        "aadharCard": _aadharController.text.trim(),
      };

      // Add optional fields only if they have values
      if (_amountController.text.isNotEmpty) {
        requestBody["loanAmount"] = int.tryParse(_amountController.text) ?? 0;
      }

      if (_creditScoreController.text.isNotEmpty) {
        requestBody["creditScore"] = int.tryParse(_creditScoreController.text) ?? 0;
      }

      if (_monthlyIncomeController.text.isNotEmpty) {
        requestBody["annualIncome"] = (int.tryParse(_monthlyIncomeController.text) ?? 0) * 12;
      }

      // Make the API call
      final response = await http.post(
        Uri.parse('http://10.247.14.235:8080/api/customer/lead-submit'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(requestBody),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lead submitted successfully! Tracking ID: ${responseData['trackingToken']}'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context);
        }
      } else {
        throw Exception('Failed to submit lead: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error submitting lead: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  void saveDraft() {
    // You can implement local storage here if needed
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Draft saved locally')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Lead')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full Name *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter full name';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _phoneController,
              decoration: const InputDecoration(labelText: 'Phone *'),
              keyboardType: TextInputType.phone,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter phone number';
                }
                if (!RegExp(r'^\+?[1-9]\d{9,14}$').hasMatch(value.trim())) {
                  return 'Please enter a valid phone number';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email *'),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter email';
                }
                if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),

            DropdownButtonFormField<String>(
              value: selectedProduct,
              items: products.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    selectedProduct = value;
                  });
                }
              },
              decoration: const InputDecoration(labelText: 'Product Type *'),
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _locationController,
              decoration: const InputDecoration(labelText: 'Address *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter address';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _aadharController,
              decoration: const InputDecoration(labelText: 'Aadhar Card Number *'),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter Aadhar card number';
                }
                return null;
              },
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _existingRelationshipController,
              decoration: const InputDecoration(labelText: 'Existing Relationship (optional)'),
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _amountController,
              decoration: const InputDecoration(labelText: 'Loan Amount (optional)'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _creditScoreController,
              decoration: const InputDecoration(labelText: 'Credit Score (optional)'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _monthlyIncomeController,
              decoration: const InputDecoration(labelText: 'Monthly Income (optional)'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),

            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(labelText: 'Additional Notes'),
              maxLines: 3,
            ),
            const SizedBox(height: 16),

            Row(
              children: [
                OutlinedButton(
                  onPressed: isLoading ? null : saveDraft,
                  child: const Text('Save Draft'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: isLoading ? null : submitLead,
                    child: isLoading
                        ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                        : const Text('Submit Enquiry'),
                  ),
                ),
              ],
            )
          ]),
        ),
      ),
    );
  }
}