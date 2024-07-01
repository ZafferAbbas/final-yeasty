import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');
import nodemailer from "nodemailer";
import { cookies } from 'next/headers'; // Import cookies

export async function POST(request: NextRequest) {
  try {
      await connect();

      const { email, password } = await request.json();
      const user = await UserAuthModal.findOne({ email: email });
      if (!user) {
        return NextResponse.json({
          message: "Invalid email or password",
        }, {
          status: 404,
        
        });
      }

      if (user.password === password) {
        const token = jwt.sign({ _id: user._id, userType: "user" }, process.env.JET_SECREAT);
      //   res.cookies.set("token", token, {
      //     expire: new Date() + 9999,
      //     httpOnly: true,
      //     secure: true,
      //     sameSite: "Strict",
      //   });
      const response = NextResponse.json({
          token,
          message: "Login successful",
        },{
          status: 200,
          // headers: { 'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=9999` }
        });

        response.cookies.set("token", token, {
          maxAge: 9999,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        return response;
      } else {
        return NextResponse.json({
          message: "Invalid email or password",
        },{
          status: 404,
        });
      }

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