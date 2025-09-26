import 'package:codeishack/profilescreen.dart';
import 'package:codeishack/splashscreen.dart';
import 'package:codeishack/supportscreen.dart';
import 'package:flutter/material.dart';
import 'authscreen.dart';
import 'createleads.dart';
import 'dashboard.dart';
import 'leaddetails.dart';
import 'leadscreen.dart';
import 'notiscreen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Codeissance',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.indigo,
      ),
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/auth': (context) => const AuthScreen(),
        '/home': (context) => const HomeScreen(),
        '/createLead': (context) => const CreateLeadScreen(),
        '/trackLeads': (context) => const TrackLeadsScreen(),
        '/leadDetail': (context) => const LeadDetailScreen(),
        '/notifications': (context) => const NotificationsScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/support': (context) => const SupportScreen(),
      },
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: SplashScreen(),
      );
  }
}
