import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createClerkClient } from "@clerk/backend";
import * as MongoActions from "../../lib/mongo.action";

const clerk = createClerkClient({ 
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY 
});

async function getUserIdFromRequest(request: Request) {
  try {
    const authRequest = await clerk.authenticateRequest(request);
    if (authRequest.isSignedIn) {
      return authRequest.toAuth().userId;
    }
  } catch (e) {
    console.error("Manual auth check failed:", e);
  }
  return null;
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserIdFromRequest(args.request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const url = new URL(args.request.url);
  const type = url.searchParams.get("type");

  if (type === "community") {
    const projects = await MongoActions.getPublicProjects();
    return { projects };
  }

  const projects = await MongoActions.getProjects(userId);
  return { projects };
}

export async function action(args: ActionFunctionArgs) {
  const userId = await getUserIdFromRequest(args.request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await args.request.json();
  const { action, ...data } = body;

  switch (action) {
    case "create":
      const newProject = await MongoActions.createProject({
        ...data.item,
        userId,
        userName: data.userName,
      });
      return { project: newProject };

    case "updateVisibility":
      const updated = await MongoActions.updateProjectVisibility(
        data.projectId,
        data.isPublic,
        userId
      );
      return { project: updated };

    case "delete":
      await MongoActions.deleteProject(data.projectId, userId);
      return { success: true };

    default:
      return new Response("Invalid action", { status: 400 });
  }
}
