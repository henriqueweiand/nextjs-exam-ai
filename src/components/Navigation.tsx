import { UserButton } from "@clerk/nextjs";

export function Navigation() {
  return (
    <nav className="border-b mb-4">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Exam System</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  );
}
