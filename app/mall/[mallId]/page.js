import RestaurantList from '@/components/RestaurantList';

export default async function MallPage({ params }) {
    const { mallId } = await params;
    return <RestaurantList mallId={mallId} />;
}
