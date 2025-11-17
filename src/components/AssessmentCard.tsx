import { Assessment } from '../types/assessment';
import { Clock, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface AssessmentCardProps {
  assessment: Assessment;
  index: number;
}

export function AssessmentCard({ assessment, index }: AssessmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">{assessment.name}</h3>
        </div>
        <a
          href={assessment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="View on SHL"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assessment.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {assessment.test_type.map((type, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
          >
            {type}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{assessment.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            {assessment.adaptive_support === 'Yes' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Adaptive</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Adaptive</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {assessment.remote_support === 'Yes' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Remote</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Remote</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
