import type { MetaFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
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

  // Call the FastAPI backend
  if (typeof entry !== "string") {
    return { summary: "No entry provided.", original: "" };
  }

  try {
    const res = await fetch("https://7yx5ndt6qaclpxjy3vfajtwpaa0krylu.lambda-url.eu-north-1.on.aws/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json() as { summary: string, recommendation: string };
    return { summary: data.summary, recommendation: data.recommendation, original: entry };
  } catch (error) {
    console.error("Error calling backend:", error);
    return { 
      summary: "Sorry, there was an error processing your entry. Please try again.", 
      recommendation: "Please check that the backend service is running and try again.",
      original: entry 
    };
  }
}

// 3. Main UI
export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(34,197,94,0.15)_1px,_transparent_0)] bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgb(34,197,94,0.03)_0%,_transparent_50%)]"></div>
      
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-200 p-8 shadow-xl dark:bg-gray-800/80 dark:border-green-700/50">
          
          {/* Enhanced Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              Moodscribe
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Reflect on your day and discover insights about your emotional journey.
            </p>
          </header>

          {/* Enhanced Journal Entry Form */}
          <Form method="post" className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="entry" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                How was your day today?
              </label>
              <div className="relative">
                <textarea
                  id="entry"
                  name="entry"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  rows={8}
                  required
                  disabled={isSubmitting}
                  placeholder="Share your thoughts, feelings, and experiences from today. What moments stood out? How did you feel? What challenged or inspired you?"
                  className="w-full resize-none rounded-xl border-2 border-green-200 bg-white/50 p-4 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 dark:border-green-700/50 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <span className={`text-xs transition-colors ${
                    entry.length > 500 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                  }`}>
                    {entry.length} characters
                  </span>
                  {entry.length > 500 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Button */}
            <button
              type="submit"
              disabled={!entry.trim() || isSubmitting}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-600 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing your thoughts...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Discover Your Insights</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {!isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </Form>

          {/* Enhanced AI Response */}
          {actionData?.summary && (
            <div className="space-y-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 shadow-inner dark:from-gray-800/50 dark:to-green-900/20 dark:border-green-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                  Your Personal AI Insights
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg p-4 border border-green-100 dark:border-green-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                        Emotional Summary
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {actionData.summary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg p-4 border border-green-100 dark:border-green-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        Wellness Recommendation
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {actionData.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-4 border-t border-green-200/50 dark:border-green-700/50">
                <button
                  onClick={() => setEntry("")}
                  className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/70 transition-colors duration-200"
                >
                  Write New Entry
                </button>
                <button
                  onClick={() => {
                    if (actionData?.original) {
                      navigator.clipboard.writeText(`Entry: ${actionData.original}\n\nSummary: ${actionData.summary}\n\nRecommendation: ${actionData.recommendation}`);
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/70 transition-colors duration-200"
                >
                  Copy Insights
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}