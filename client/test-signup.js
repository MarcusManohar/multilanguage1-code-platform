import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://sfisulyexdnqztrjusht.supabase.co', 'sb_publishable_1B2pHrxAdgjepDeBRmEL-w_NosFqZqr');

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'Test User'
      }
    }
  });
  if (error) {
    console.error('Signup error:', error.message);
  } else {
    console.log('Signup success:', data.user ? data.user.email : 'No user');
  }
}

testSignup();
