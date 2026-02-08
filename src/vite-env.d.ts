/// <reference types="vite/client" />

declare module '@vercel/speed-insights/react' {
    import React from 'react';

    interface SpeedInsightsProps {
        dsn?: string;
        beforeSend?: (event: any) => any | Promise<any>;
        debug?: boolean;
        sampleRate?: number;
        route?: string | null;
        scriptSrc?: string;
    }

    export const SpeedInsights: React.FC<SpeedInsightsProps>;
}

declare module 'upscaler' {
    export default class Upscaler {
        constructor(options?: any);
        execute(image: string, options?: any): Promise<string>;
    }
}

declare module '@upscalerjs/esrgan-slim' {
    const model: any;
    export default model;
}
