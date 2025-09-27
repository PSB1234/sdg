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

  Map<String, dynamic> toJson() {
    return {
      'user': {
        '_id': id,
        'name': name,
        'email': email,
        'age': age,
        'roles': roles,
        'isActive': isActive,
        'isEmailVerified': isEmailVerified,
        'loginAttempts': loginAttempts,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
        'permissions': permissions,
      }
    };
  }
}