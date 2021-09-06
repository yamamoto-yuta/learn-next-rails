import { useRouter } from "next/router";

function RecipePage() {
    const router = useRouter();
    return <h1>Recipe Id: {router.query.id}</h1>;
}

export default RecipePage;