import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")

export async function POST(request: NextRequest) {
    try {
        await connect();

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);


        if (decoded.userType === "user") {
            const Record = await ItemModal.find({ userId: decoded._id }).sort('position');
            if (Record) {
                return NextResponse.json({
                    status: "success",
                    message: "Get All Products Successfully",
                    data: Record,
                }, {
                    status: 200,
                });
            } 
        } else {
            return NextResponse.json({
                status: "error",
                message: "You are not authorized. Please sign in as a user to continue",
            }, {
                status: 400,
            });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({
          message: "Something went wrong",
        },{
          status: 500,
        });
    }
    
}