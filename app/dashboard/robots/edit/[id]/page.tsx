import Link from "next/link";
import RobotForm from "../(robots-forms)/robot-form.server";

import { db } from "@/db";
import { getRobotWithRelations } from "@/lib/queries";

export default async function EditRobotPage({ params, searchParams }: any) {
  const id = Number(params.id || searchParams?.id);
  // Get the robot data with user and competition relations
  const initialValue = await getRobotWithRelations(id);

  if (!initialValue) {
    return (
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Robot Not Found</h1>
            <p className="py-6">The robot you are trying to edit does not exist or has been deleted.</p>
            <Link href={"./dashboard/robots"} className="btn btn-primary">
              Return to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <RobotForm robotId={id} initialValues={initialValue} />;
}
