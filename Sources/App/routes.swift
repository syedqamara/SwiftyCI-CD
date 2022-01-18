import Fluent
import Vapor





func routes(_ app: Application) throws {
    app.sessions.configuration.cookieName = "__product__hunter__cookies__"
    app.sessions.use(.fluent)
    let sessionChecked = app.routes.grouped([
        app.sessions.middleware,
        UserAuthTokenSessionAuthenticator(),
        UserAuthToken.sessionAuthenticator(.psql),
    ])
    let protected = app.routes.grouped([
        app.sessions.middleware,
        UserAuthTokenSessionAuthenticator(),
        UserBearerAuthenticator(),
        User.guardMiddleware(),
    ])
    app.get("") { req in
        return req.redirect(to: "web", type: .permanent)
    }
    try app.register(collection: AuthController())
    try sessionChecked.register(collection: WebController())
    try protected.register(collection: UserController())
    try protected.register(collection: RoleController())
    try protected.register(collection: RolePermissionController())
    app.routes.defaultMaxBodySize = "10mb"
}
