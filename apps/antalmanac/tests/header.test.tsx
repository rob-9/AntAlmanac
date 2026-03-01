import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import { Header } from '$components/Header/Header';
import { useSessionStore } from '$stores/SessionStore';

vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt={alt} {...props} />,
}));

vi.mock('$hooks/useIsMobile', () => ({
    useIsMobile: () => false,
}));

vi.mock('$lib/localStorage', async () => {
    const actual = await vi.importActual<typeof import('$lib/localStorage')>('$lib/localStorage');
    return {
        ...actual,
        getLocalStorageImportedUser: () => null,
        getLocalStorageDataCache: () => null,
        removeLocalStorageImportedUser: vi.fn(),
        removeLocalStorageDataCache: vi.fn(),
    };
});

const ENV_KEY = 'NEXT_PUBLIC_BASE_URL';

describe('Header planner button', () => {
    beforeEach(() => {
        delete process.env[ENV_KEY];
        useSessionStore.setState({ session: null, sessionIsValid: false });
    });

    test('planner button links to full URL when NEXT_PUBLIC_BASE_URL is set', () => {
        process.env[ENV_KEY] = 'antalmanac.com';

        render(<Header />);

        const plannerLinks = screen.getAllByRole('link', { name: /planner/i });
        expect(plannerLinks.length).toBeGreaterThan(0);
        expect(plannerLinks[0].getAttribute('href')).toBe('https://antalmanac.com/planner');
    });

    test('planner button is disabled when NEXT_PUBLIC_BASE_URL is not set', () => {
        render(<Header />);

        const plannerButtons = screen.getAllByRole('button', { name: /planner/i });
        expect(plannerButtons.length).toBeGreaterThan(0);
        expect(plannerButtons[0].getAttribute('aria-disabled')).toBe('true');
    });

    test('scheduler button is always rendered', () => {
        render(<Header />);

        const schedulerButtons = screen.getAllByRole('button', { name: /scheduler/i });
        expect(schedulerButtons.length).toBeGreaterThan(0);
    });
});
