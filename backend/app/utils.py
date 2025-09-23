from flask import request, current_app

def paginate_query(query):
    try:
        page = int(request.args.get("page", 1))
    except Exception:
        page = 1
    per_page = int(request.args.get("per_page", current_app.config.get("PAGE_SIZE", 10)))
    items = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [i.to_dict() for i in items.items],
        "total": items.total,
        "page": items.page,
        "pages": items.pages,
        "per_page": items.per_page,

    }