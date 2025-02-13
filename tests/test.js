// Custom test logic

const BASE_URL = 'http://localhost:3000/api';

let employeeToken;
let managerToken;
let adminToken;
let bookingRequestId;

// Test data
const testUsers = {
    employee: {
        username: 'kannan.employee',
        password: 'password123',
        role: 'employee'
    },
    manager: {
        username: 'sura.manager',
        password: 'password123',
        role: 'team_manager'
    },
    admin: {
        username: 'babu.admin',
        password: 'password123',
        role: 'admin'
    }
};

// Logging utility functions
function logRequest(method, endpoint, data = null, token = null) {
    console.log('\n📤 REQUEST:');
    console.log('  Method:', method);
    console.log('  Endpoint:', endpoint);
    if (data) console.log('  Body:', JSON.stringify(data, null, 2));
    if (token) console.log('  Token:', token.substring(0, 15) + '...');
}

function logResponse(response, data) {
    console.log('\n📥 RESPONSE:');
    console.log('  Status:', response.status, response.statusText);
    console.log('  Time:', new Date().toISOString());
    console.log('  Data:', JSON.stringify(data, null, 2));
}

function logStep(step, description) {
    console.log('\n' + '='.repeat(50));
    console.log(`🔷 STEP ${step}: ${description}`);
    console.log('='.repeat(50));
}

function logError(error, context) {
    console.error('\n❌ ERROR:', context);
    console.error('  Message:', error.message);
    console.error('  Stack:', error.stack);
}

// Helper function to make API calls with timing
async function callAPI(endpoint, method = 'GET', data = null, token = null) {
    const startTime = performance.now();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null
    };

    try {
        logRequest(method, endpoint, data, token);
        
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
       // console.log(await response.text())
        const responseData = await response.json();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        logResponse(response, responseData);
        console.log('  Duration:', duration, 'ms');

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return responseData;
    } catch (error) {
        logError(error, `API call to ${endpoint}`);
        throw error;
    }
}

// Test all APIs in sequence
async function runTests() {
    console.log('\n🚀 Starting API tests at:', new Date().toISOString());
    console.log('Server URL:', BASE_URL);

    try {
        // 1. Create users
        logStep('1', 'Creating Users');
       for (const [role, userData] of Object.entries(testUsers)) {
            const result = await callAPI('/register', 'POST', userData);
            console.log(`\n✅ Created ${role}:`);
            console.log('  ID:', result.id);
            console.log('  Username:', result.username);
            console.log('  Role:', result.role);
        }

        // 2. Login with all users
        logStep('2', 'Testing User Login');
        
        console.log('\n🔑 Employee Login:');
        const employeeLogin = await callAPI('/login', 'POST', {
            username: testUsers.employee.username,
            password: testUsers.employee.password
        });
        employeeToken = employeeLogin.token;

        console.log('\n🔑 Manager Login:');
        const managerLogin = await callAPI('/login', 'POST', {
            username: testUsers.manager.username,
            password: testUsers.manager.password
        });
        managerToken = managerLogin.token;

        console.log('\n🔑 Admin Login:');
        const adminLogin = await callAPI('/login', 'POST', {
            username: testUsers.admin.username,
            password: testUsers.admin.password
        });
        adminToken = adminLogin.token;

        // 3. Create booking request
        logStep('3', 'Creating Booking Request');
        const bookingRequest = await callAPI('/booking-requests', 'POST', {
            booking_date: '2025-03-01'
        }, employeeToken);
        bookingRequestId = bookingRequest.id;
        console.log('\n📝 Booking Request Details:');
        console.log('  ID:', bookingRequestId);
        console.log('  Date:', bookingRequest.booking_date);
        console.log('  Initial Status:', bookingRequest.status);

        // 4. List all requests
        logStep('4', 'Listing All Requests');
        const allRequests = await callAPI('/booking-requests', 'GET', null, employeeToken);
        console.log('\n📋 Request Summary:');
        console.log('  Total Requests:', allRequests.length);
        console.log('  Requests by Status:');
        const statusCount = allRequests.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
        }, {});
        Object.entries(statusCount).forEach(([status, count]) => {
            console.log(`    ${status}: ${count}`);
        });

        // 5. Manager approves request
        logStep('5', 'Manager Approval Process');
        const managerApproval = await callAPI(
            `/booking-requests/${bookingRequestId}/manager-action`,
            'PUT',
            { action: 'approve' },
            managerToken
        );
        console.log('\n👔 Manager Approval Details:');
        console.log('  New Status:', managerApproval.status);
        console.log('  Action Time:', managerApproval.manager_action_at);

        // 6. Admin approves request
        logStep('6', 'Admin Approval Process');
        const adminApproval = await callAPI(
            `/booking-requests/${bookingRequestId}/admin-action`,
            'PUT',
            { action: 'approve' },
            adminToken
        );
        console.log('\n👑 Admin Approval Details:');
        console.log('  New Status:', adminApproval.status);
        console.log('  Action Time:', adminApproval.admin_action_at);

        // 7. Final status check
        logStep('7', 'Final Status Verification');
        const finalRequests = await callAPI('/booking-requests', 'GET', null, employeeToken);
        const finalRequest = finalRequests.find(req => req.id === bookingRequestId);
        console.log('\n🎯 Final Request State:');
        console.log('  ID:', finalRequest.id);
        console.log('  Status:', finalRequest.status);
        console.log('  Booking Date:', finalRequest.booking_date);
        console.log('  Creation Time:', finalRequest.created_at);
        console.log('  Manager Action Time:', finalRequest.manager_action_at);
        console.log('  Admin Action Time:', finalRequest.admin_action_at);

        console.log('\n✨ Test Summary:');
        console.log('  Start Time:', new Date().toISOString());
        console.log('  All steps completed successfully');
        console.log('  Total requests processed:', finalRequests.length);

    } catch (error) {
        console.error('\n💥 Test Suite Error:');
        console.error('  Time:', new Date().toISOString());
        console.error('  Error:', error.message);
        console.error('  Stack:', error.stack);
    }
}

// Run the tests
console.clear();
console.log('🔬 Workspace Reservation System API Test Suite');
runTests();