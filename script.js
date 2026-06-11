import crypto from 'crypto';
import { io } from 'socket.io-client';
// const crypto = require('crypto');
// const { io } = require('socket.io-client');

// const HOST = 'http://localhost:8082';
const HOST = 'https://inculpably-nonsaving-dylan.ngrok-free.dev';
const OPERATOR_CODE = 'dev-operator';
const SECRET = 'dev-operator-shared-secret';

// Helper function to handle HMAC generation
function generateOperatorHeaders(body = '') {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const bodyHash = crypto.createHash('sha256').update(body).digest('hex');

    const signature = crypto
        .createHmac('sha256', SECRET)
        .update(`${timestamp}:${bodyHash}`)
        .digest('hex');

    return {
        'Content-Type': 'application/json',
        'X-Provider-Code': OPERATOR_CODE,
        'X-Provider-Timestamp': timestamp,
        'X-Provider-Signature': signature
    };
}

async function runTest() {
    console.log("🚀 1. Launching Game Session...");

    const launchBody = JSON.stringify({
        gameCode: 'crash',
        playerExternalId: 'tester-123',
        currency: 'USD',
        mode: 'real'
    });

    const launchRes = await fetch(`${HOST}/operator/v1/launch`, {
        method: 'POST',
        headers: generateOperatorHeaders(launchBody),
        body: launchBody
    });

    const launchData = await launchRes.json();

    if (!launchRes.ok) {
        throw new Error(`Launch failed: ${JSON.stringify(launchData)}`);
    }

    // Extract token from launch URL parameter
    const launchUrl = new URL(launchData.data.launchUrl);
    const token = launchUrl.searchParams.get('token');

    console.log("✅ Successfully got JWT Token:", token);

    console.log("\n🔌 2. Connecting to Socket.io...");

    const socket = io(`${HOST}/crash-game`, {
        auth: { token },
        transports: ['websocket'],
        path: '/api/socket'
    });

    socket.on('connect_error', (err) => {
        console.error('❌ Connection error:', err.message);
    });

    socket.on('connect', () => {
        console.log(`✅ Socket connected! ID: ${socket.id}`);
    });

    socket.on('/crash-game/roundStarted', () => {
        // placeBet(token);
    });

    socket.onAny((event, data) => {
        if (!event.includes('placedBets')) {
            if (event.includes('graphTimer')) {
                let crashRate = data.data?.crashRate ?? undefined;
                console.log(event, data);
            } else if (event.includes('waitingTimer')) {
                console.log(
                    event,
                    data.data?.runningStatus,
                    data.data?.secondTenths,
                    data.data?.seconds
                );
            } else {
                console.log(event, data);
            }
        }
    });
}

async function placeBet(token) {
    console.log("\n💸 3. Placing a test bet...");

    const betRes = await fetch(`${HOST}/runtime/v1/crash/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ betAmount: 15.0, autoRate: 2.0 })
    });

    const betData = await betRes.json();

    if (betRes.ok) {
        console.log("✅ Bet placed successfully:", betData);
    } else {
        console.error("❌ Bet failed:", betData);
    }
}

// Start the flow
runTest().catch(console.error);