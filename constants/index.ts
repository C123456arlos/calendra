export const DAYS_OF_WEEK_IN_ORDER = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
] as const

export const PrivateNavLinks = [
    {
        imgURL: '/assets/events.svg',
        route: '/events',
        label: 'my events'
    },
    {
        imgURL: '/assets/schedule.svg',
        route: '/schedule',
        label: 'my schedule'
    },
    {
        imgURL: '/assets/public.svg',
        route: '/book',
        label: 'public profile'
    }
] as const