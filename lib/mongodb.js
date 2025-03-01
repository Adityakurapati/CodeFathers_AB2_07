import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;

if ( !MONGODB_URI )
{
        throw new Error(
                "Please define the MONGODB_URI environment variable inside .env.local"
        );
}

// Create a global mongoose connection
let cached=global.mongoose;

if ( !cached )
{
        cached=global.mongoose={ conn: null, promise: null };
}

export async function connectToDatabase ()
{
        if ( cached.conn )
        {
                return cached.conn;
        }

        if ( !cached.promise )
        {
                const opts={
                        bufferCommands: false,
                };

                cached.promise=mongoose.connect( MONGODB_URI, opts ).then( ( mongoose ) =>
                {
                        // Set up the event listeners after connection is initialized
                        mongoose.connection.on( "error", ( err ) =>
                        {
                                console.error( "MongoDB connection error:", err );
                        } );

                        mongoose.connection.once( "open", () =>
                        {
                                console.log( "Connected to MongoDB" );
                        } );

                        return mongoose;
                } );
        }

        try
        {
                cached.conn=await cached.promise;
        } catch ( e )
        {
                cached.promise=null;
                throw e;
        }

        return cached.conn;
}