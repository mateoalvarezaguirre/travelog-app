import { TravelEntry } from '@modules/travel/domain/Types/TravelEntry';

export const mockTravelData: TravelEntry[] = [
    {
        id: '1',
        title: 'Aventura en Kioto',
        location: 'Japón',
        description: 'Templos antiguos, sakura y cultura samurái.',
        coverPicture: 'https://picsum.photos/400?random=10',
        content: [
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=11',
                note: 'Un hermoso templo en Kioto durante la temporada de sakura.',
                date: '2023-10-02'
            },
            {
                type: 'video',
                uri: 'travelShort.mp4',
                note: 'Un breve recorrido por los templos de Kioto.',
                date: '2023-10-02'
            },
            {
                type: 'note',
                title: 'Descubriendo Kioto',
                text: 'Explorando los templos antiguos de Kioto y disfrutando de la cultura samurái.',
                date: '2023-10-02'
            },
            {
                type: 'note',
                title: '¡Mucha comida nueva!',
                text: 'Probando la deliciosa comida local y disfrutando de la hospitalidad japonesa.',
                date: '2023-10-02'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=12',
                note: 'Un plato típico japonés que probé en Kioto.',
                date: '2023-10-02'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=13',
                note: 'Un hermoso jardín japonés en Kioto.',
                date: '2023-10-02'
            },
        ],
        dateStart: '2023-10-01',
        dateEnd: '2023-10-15',
        tags: ['cultura', 'aventura'],
    },
    {
        id: '2',
        title: 'Explorando Patagonia',
        location: 'Argentina',
        description: 'Montañas, glaciares y mucho trekking.',
        coverPicture: 'https://picsum.photos/400?random=20',
        content: [
            {
                type: 'note',
                title: 'Descubriendo la Patagonia',
                text: 'Disfrutando de la belleza natural de la Patagonia y haciendo trekking en los glaciares.',
                date: '2023-11-02'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=21',
                note: 'Un impresionante glaciar en la Patagonia.',
                date: '2023-11-02'
            },
            {
                type: 'video',
                uri: 'travelShort.mp4',
                note: 'Un breve recorrido por los glaciares de la Patagonia.',
                date: '2023-11-02'
            },
            {
                type: 'note',
                title: 'Visitando Torres del Paine',
                text: 'Visitando Torres del Paine y disfrutando de sus impresionantes paisajes.',
                date: '2023-11-05'
            },
            {
                type: 'photo',
                note: 'Paisajes de Patagonia',
                uri: 'https://picsum.photos/400?random=22',
                date: '2023-11-05'
            },
            {
                type: 'photo',
                note: 'Paisajes de Patagonia',
                uri: 'https://picsum.photos/400?random=23',
                date: '2023-11-05'
            },
        ],
        dateStart: '2023-11-01',
        dateEnd: '2023-11-10',
        tags: ['naturaleza', 'aventura'],
    },
    {
        id: '3',
        title: 'Safari en Serengeti',
        location: 'Tanzania',
        description: 'Vida salvaje y paisajes impresionantes.',
        coverPicture: 'https://picsum.photos/400?random=30',
        content: [
            {
                type: 'note',
                title: 'Safari en Serengeti',
                text: 'Observando la migración de ñus y disfrutando de la fauna salvaje del Serengeti.',
                date: '2023-12-02'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=31',
                note: 'Un majestuoso león en el Serengeti.',
                date: '2023-12-02'
            },
            {
                type: 'video',
                uri: 'travelShort.mp4',
                note: 'Un breve recorrido por el Serengeti durante el safari.',
                date: '2023-12-02'
            },
            {
                type: 'note',
                title: 'Descubriendo Serengeti',
                text: 'Visitando una aldea Maasai y aprendiendo sobre su cultura.',
                date: '2023-12-05'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=32',
                note: '¡¡Simplemente increíble!!',
                date: '2023-12-05'
            },
        ],
        dateStart: '2023-12-01',
        dateEnd: '2023-12-15',
        tags: ['naturaleza', 'aventura'],
    },
    {
        id: '4',
        title: 'Cultura en Marrakech',
        location: 'Marruecos',
        description: 'Zocos, palacios y gastronomía única.',
        coverPicture: 'https://picsum.photos/400?random=40',
        content: [
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=41',
                note: 'Un hermoso palacio en Marrakech.',
                date: '2024-01-02'
            },
            {
                type: 'note',
                title: 'Descubriendo Marrakech',
                text: 'Explorando los zocos de Marrakech y disfrutando de la cultura local.',
                date: '2024-01-02'
            },
            {
                type: 'video',
                uri: 'travelShort.mp4',
                note: 'Un breve recorrido por el Serengeti.',
                date: '2024-01-02'
            },
            {
                type: 'note',
                text: 'Probando la deliciosa comida marroquí en un riad.',
                title: '¡Qué rico!',
                date: '2024-01-05'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=42',
                note: 'Un breve recorrido por el Serengeti.',
                date: '2024-01-05'
            },
        ],
        dateStart: '2024-01-01',
        dateEnd: '2024-01-10',
        tags: ['cultura', 'gastronomía'],
    },
    {
        id: '5',
        title: 'Relajación en Bali',
        location: 'Indonesia',
        description: 'Playas paradisíacas y templos antiguos.',
        coverPicture: 'https://picsum.photos/400?random=50',
        content: [
            {
                type: 'note',
                title: 'Descubriendo Bali',
                text: 'Disfrutando de las playas de Bali y visitando templos antiguos.',
                date: '2024-02-01'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=51',
                note: 'Un breve recorrido por el Serengeti.',
                date: '2024-02-01'
            },
            {
                type: 'video',
                uri: 'travelShort.mp4',
                note: 'Un breve recorrido por el Serengeti.',
                date: '2024-02-01'
            },
            {
                type: 'note',
                title: 'Descubriendo Marrakech',
                text: 'Aprendiendo a surfear en las olas de Kuta.',
                date: '2024-02-02'
            },
            {
                type: 'photo',
                uri: 'https://picsum.photos/400?random=52',
                note: 'Un breve recorrido por el Serengeti.',
                date: '2024-02-02'
            },
        ],
        dateStart: '2024-02-01',
        dateEnd: '2024-02-15',
        tags: ['relajación', 'playa'],
    },
];
