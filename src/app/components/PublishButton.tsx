import {publishPortfolio} from "@/functions/databaseAccess";
import {useRouter} from "next/navigation";

interface PublishButtonProps {
    portfolioId: string;
    openPublishedPortfolio: boolean;
    className?: string;
}

export default function PublishButton({portfolioId, openPublishedPortfolio, className}: PublishButtonProps){
    const router = useRouter();

    const handleClick = async () => {
        const publishedPageLink = await publishPortfolio(portfolioId);
        if (publishedPageLink && openPublishedPortfolio){
            router.push(publishedPageLink);
        }
    }

    return (
        <button className={className} onClick={handleClick}>
            Publish
        </button>
    );
}