import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://sfisulyexdnqztrjusht.supabase.co', 'sb_publishable_1B2pHrxAdgjepDeBRmEL-w_NosFqZqr');

async function testProfiles() {
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert([{ id: '11111111-1111-1111-1111-111111111111', full_name: 'Test' }], { onConflict: 'id' });
  console.log('Upsert with full_name Error:', upsertError);
}

testProfiles();
