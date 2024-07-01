import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";


export async function POST(request: NextRequest) {
    try {
        await connect();

        const { fullName, email, password, companyName, hearFrom  } = await request.json();
  
        const user = await UserAuthModal.findOne({ email: email }).exec();
        if (user) {
          return NextResponse.json({
            status: "error",
            message: "User already exists",
          }, {
            status: 400,
          });
        }
    
        const newUser = new UserAuthModal({
          fullName,
          email,
          password,
          companyName,
          hearFrom,
        });
    
        await newUser.save();
        return NextResponse.json({
          status: "success",
          message: "User account created successfully",
        },{
            status: 200,
        });
  
    }
    catch (error) {
        console.log(error);
        NextResponse.json({
          message: "Something went wrong",
        },{
          status: 500,
        });
    }
    
}