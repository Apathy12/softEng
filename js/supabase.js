// Supabase configuration
const supabase = window.supabase.createClient(
    "https://yyvccwdfjtdauzqpdvuk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dmNjd2RmanRkYXV6cXBkdnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzU4NzgsImV4cCI6MjA2MTg1MTg3OH0.Kx2k_gZ1vcLQiLX_dbuqupQwC7V3Fey-_utVkVlgHPQ"
);
  

// Example functions for database operations
async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    return { data, error };
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    return { data, error };
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

// Contact form submission
async function submitContactForm(name, address, phone) {
    const { data, error } = await supabase
        .from('contacts')
        .insert([
            { 
                name: name,
                email: email,
                phone: phone
            }
        ]);
    return { data, error };
}

// Export functions
window.supabase = {
    signUp,
    signIn,
    signOut,
    submitContactForm,
    client: supabase
}; 

// Function to get contact by ID
async function getContactById(id) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

// Make functions available
window.supabaseFunctions = {
  getContactById
};