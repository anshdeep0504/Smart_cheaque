import React from 'react';

// FIX: Update Icon component to explicitly handle a `title` prop. This resolves TypeScript errors
// in ChequeTable.tsx and improves accessibility by rendering an SVG `<title>` element.
interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: 'logo' | 'pending' | 'cleared' | 'bounced' | 'alert' | 'clock' | 'ai' | 'send' | 'loading' | 'paperclip' | 'scan' | 'chevron-down';
    title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, title, ...props }) => {
    const titleElement = title ? <title>{title}</title> : null;

    switch (name) {
        case 'logo':
            return (
                <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w.org/2000/svg">
                    {titleElement}
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8H20V18ZM4 6H20V7H4V6Z" />
                    <path d="M15 14H17V16H15V14Z" />
                    <path d="M12 14H14V16H12V14Z" />
                    <path d="M9 14H11V16H9V14Z" />
                </svg>
            );
        case 'pending':
            return (
                <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'cleared':
            return (
                <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'bounced':
            return (
                <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'alert':
            return (
                 <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case 'clock':
             return (
                 <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
            );
        case 'ai':
            return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {titleElement}
                    <path d="M12 8V4H8" />
                    <rect x="4" y="12" width="16" height="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v-2a3 3 0 0 0-3-3H9" />
                </svg>
            );
        case 'send':
             return (
                 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {titleElement}
                     <line x1="22" y1="2" x2="11" y2="13"></line>
                     <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                 </svg>
            );
        case 'loading':
            return (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {titleElement}
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            );
        case 'paperclip':
             return (
                 <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                 </svg>
             );
        case 'scan':
            return (
                <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {titleElement}
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <path d="M7 12h10" />
                </svg>
            );
         case 'chevron-down':
            return (
                <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {titleElement}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        default:
            return null;
    }
};