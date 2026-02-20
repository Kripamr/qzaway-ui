import MenuPage from '@/components/MenuPage';

export default async function RestaurantPage({ params }) {
    const { mallId, restaurantId } = await params;
    return <MenuPage mallId={mallId} restaurantId={restaurantId} />;
}
