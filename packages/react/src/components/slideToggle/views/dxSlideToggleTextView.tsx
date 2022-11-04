import React from 'react';

interface DxSlideToggleTextViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        text: string;
    }
}

const DxSlideToggleTextView = ({ data: { text } }: DxSlideToggleTextViewProps) => {
    return (
        <div>
            {text}
        </div>
    );
};

export type { DxSlideToggleTextViewProps };
export { DxSlideToggleTextView };
