'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { WizardStep } from '../create-pool/types';
import clsx from 'clsx';

interface Step {
  key: WizardStep;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

export default function ProgressSteps({ steps, currentStep, onStepClick }: ProgressStepsProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <nav aria-label="Progress" className="bg-black/40 border border-green-500/30 rounded-lg p-6 terminal-border backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="font-mono text-green-400 uppercase tracking-wide text-sm">
          &gt; Deployment Progress
        </h3>
        <div className="h-0.5 w-full bg-gradient-to-r from-green-500 to-transparent mt-2"></div>
      </div>
      
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStepIndex;
          const isCurrent = stepIdx === currentStepIndex;
          const isClickable = stepIdx <= currentStepIndex;

          return (
            <li key={step.key} className={clsx(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative'
            )}>
              {stepIdx !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={clsx(
                    'h-0.5 w-full',
                    isCompleted ? 'bg-green-500' : 'bg-green-500/20'
                  )} />
                </div>
              )}
              
              <button
                onClick={() => isClickable && onStepClick(step.key)}
                disabled={!isClickable}
                className={clsx(
                  'relative flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-300',
                  isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed',
                  isCompleted ? 'bg-green-500 text-black border border-green-400 terminal-glow' : '',
                  isCurrent ? 'border-2 border-green-500 bg-black text-green-400 terminal-glow' : '',
                  !isCompleted && !isCurrent ? 'border-2 border-green-500/30 bg-black/60 text-green-500/50' : ''
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-6 w-6 text-black" aria-hidden="true" />
                ) : (
                  <span className="text-xs">
                    {String(stepIdx + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="sr-only">{step.title}</span>
              </button>
              
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <p className={clsx(
                  'text-sm font-mono font-medium uppercase tracking-wide',
                  isCurrent ? 'text-green-400' : isCompleted ? 'text-green-300' : 'text-green-500/50'
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-green-400/60 mt-1 font-mono">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
} 