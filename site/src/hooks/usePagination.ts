import { DEFAULT_RECORDS_PER_PAGE } from "components/PaginationWidget/utils";
import type { useSearchParams } from "react-router-dom";

export const usePagination = ({
	searchParamsResult,
}: {
	searchParamsResult: ReturnType<typeof useSearchParams>;
}) => {
	const [searchParams, setSearchParams] = searchParamsResult;
	const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
	const limit = DEFAULT_RECORDS_PER_PAGE;
	const offset = calcOffset(page, limit);

	const goToPage = (page: number) => {
		searchParams.set("page", page.toString());
		setSearchParams(searchParams);
	};

	return {
		page,
		limit,
		goToPage,
		offset,
	};
};

export const calcOffset = (page: number, limit: number) => {
	return page <= 0 ? 0 : (page - 1) * limit;
};
