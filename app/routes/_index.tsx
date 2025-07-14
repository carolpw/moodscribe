import type { MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import { useState } from "react";

// 1. Set the page metadata
export const meta: MetaFunction = () => {
  return [
    { title: "Moodscribe – AI Daily Journal" },
    {
      name: "description",
      content: "Write about your day, get emotional feedback and motivation.",
    },
  ];
};

// 2. Handle form submission (server side)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const entry = formData.get("entry");

  // Here we'll later call the AI API
  return json({ summary: "AI summary goes here (coming soon)", original: entry });
}

// 3. Main UI
export default function Index() {
  const actionData = useActionData<typeof action>();
  const [entry, setEntry] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-xl space-y-8 rounded-xl border border-gray-300 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Moodscribe
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Reflect on your day and let AI help you understand it.
          </p>
        </header>

        {/* 4. Journal Entry Form */}
        <Form method="post" className="space-y-4">
          <label htmlFor="entry" className="block text-gray-700 dark:text-gray-200">
            How was your day?
          </label>
          <textarea
            id="entry"
            name="entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={6}
            required
            placeholder="Write here..."
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Analyze My Entry
          </button>
        </Form>

        {/* 5. AI Response (for now it's mock data) */}
        {actionData?.summary && (
          <div className="space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Summary:</strong> {actionData.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
