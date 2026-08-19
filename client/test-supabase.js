import { createClient } from '@supabase/supabase-js';

try {
  // Test if it initializes without error (even if URL/KEY are empty strings for now)
  const supabase = createClient('https://example.supabase.co', 'dummy-key');
  if (supabase) {
    console.log('Supabase client initialized successfully.');
  } else {
    console.error('Supabase client failed to initialize.');
    process.exit(1);
  }
} catch (e) {
  console.error('Error initializing Supabase:', e);
  process.exit(1);
}
