// Mock Database for Vercel Demo
class MockPool {
  on(event, callback) {
    if (event === 'connect') {
      setTimeout(callback, 0);
    }
  }

  async query(text, params) {
    const q = text.toLowerCase();
    
    // Auth / User identification
    if (q.includes('from users')) {
      const emailParam = (params && params.length > 0 && typeof params[0] === 'string') ? params[0] : '';
      let role = 'student';
      if (emailParam.includes('admin') || q.includes('admin')) role = 'admin';
      else if (emailParam.includes('teacher') || q.includes('teacher')) role = 'teacher';
      
      return {
        rows: [{
          id: 1,
          email: emailParam || 'admin@university.edu',
          password: 'mock_password_bypassed',
          role: role,
          is_active: true
        }]
      };
    }
    
    // Dashboards
    if (q.includes('count(*)')) {
      return { rows: [{ count: "12" }] };
    }
    
    // Profiles
    if (q.includes('select s.*') || q.includes('select t.*')) {
      return { rows: [{ id: 1, user_id: 1, first_name: 'Demo', last_name: 'User', department_name: 'Computer Science' }] };
    }

    // Default fallback mock response
    if (q.includes('returning')) {
      return { rows: [{ id: Math.floor(Math.random() * 1000) }] };
    }
    
    return { rows: [] };
  }
}

const pool = new MockPool();
console.log('✅ Mock Database connected (No DB required)');

module.exports = pool;
