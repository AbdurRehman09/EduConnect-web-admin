import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const { uid } = await request.json();
        
        if (!uid) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await admin.auth().deleteUser(uid);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
