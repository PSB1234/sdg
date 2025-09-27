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
}
