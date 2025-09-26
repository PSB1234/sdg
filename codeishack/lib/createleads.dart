import 'package:flutter/material.dart';

class CreateLeadScreen extends StatelessWidget {
  const CreateLeadScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final products = ['Home Loan', 'Car Loan', 'Credit Card', 'Personal Loan', 'Business Loan'];
    String selected = products.first;
    return Scaffold(
      appBar: AppBar(title: const Text('Create Lead')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(children: [
          TextField(decoration: const InputDecoration(labelText: 'Full Name')),
          TextField(decoration: const InputDecoration(labelText: 'Phone')),
          TextField(decoration: const InputDecoration(labelText: 'Email')),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: selected,
            items: products.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
            onChanged: (_) {},
            decoration: const InputDecoration(labelText: 'Product Type'),
          ),
          TextField(decoration: const InputDecoration(labelText: 'Amount Required (optional)'), keyboardType: TextInputType.number),
          TextField(decoration: const InputDecoration(labelText: 'Credit Score (optional)'), keyboardType: TextInputType.number),
          TextField(decoration: const InputDecoration(labelText: 'Monthly Income (optional)'), keyboardType: TextInputType.number),
          TextField(decoration: const InputDecoration(labelText: 'Location')),
          TextField(decoration: const InputDecoration(labelText: 'Additional Notes'), maxLines: 3),
          const SizedBox(height: 16),
          Row(
            children: [
              OutlinedButton(
                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Draft saved'))),
                child: const Text('Save Draft'),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lead submitted (local only)')));
                    Navigator.pop(context);
                  },
                  child: const Text('Submit Enquiry'),
                ),
              ),
            ],
          )
        ]),
      ),
    );
  }
}