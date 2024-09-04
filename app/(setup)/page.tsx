import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile"
import { RedirectToSignIn } from '@clerk/nextjs';
import {redirect} from 'next/navigation';

const SetupPage = async () => {
    const profile = await initialProfile();

    if (profile === "User not found") {
        return <RedirectToSignIn />
    } else {
        const server = await db.server.findFirst({
            where: {
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            }
        })

        if (server){
            return redirect(`/servers/${server.id}`)
        }

        return (
            <div>
                Create a server
            </div>
        )
    }


}

export default SetupPage