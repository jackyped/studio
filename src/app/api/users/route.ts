import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type UserRole = 'customers' | 'admins' | 'drivers' | 'pharmacies';

const roleToFileName: Record<UserRole, string> = {
    customers: 'customers.json',
    admins: 'admins.json',
    drivers: 'drivers.json',
    pharmacies: 'pharmacies.json',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') as UserRole | null;

  if (!role || !roleToFileName[role]) {
    return NextResponse.json({ message: 'Valid role is required' }, { status: 400 });
  }

  try {
    const fileName = roleToFileName[role];
    const filePath = path.join(process.cwd(), 'src', 'data', fileName);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading data for role ${role}:`, error);
    return NextResponse.json({ message: 'Error reading data file' }, { status: 500 });
  }
}
