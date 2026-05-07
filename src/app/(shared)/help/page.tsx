"use client";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('helpSupport')}</h1>
      <p className="text-gray-500 mb-10">
    {t('videoTutorials')}
      </p>

      {/* Placeholder grid for future YouTube videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"
          >
            {/* Video thumbnail placeholder */}
            <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#e5e7eb" />
                <path
                  d="M10 8.5L16 12L10 15.5V8.5Z"
                  fill="#9ca3af"
                />
              </svg>
            </div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
