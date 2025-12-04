import { NextResponse } from "next/server";

export async function GET() {

    return NextResponse.json({ 
        metadata_key: process.env.METADATA_KEY,
        success: true 
    });

}