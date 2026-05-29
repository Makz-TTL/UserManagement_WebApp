import { User } from "../db/schema";
import { Post } from "../db/schema/post";

type UserWithPost = User & {
  posts: Post[]
}

type BaseListProps = {
  utenti: UserWithPost[];
  currentUserId?: number | null; // <-- Aggiunto per identificare l'utente loggato
};

const BaseList = (props: BaseListProps) => {
  return (
    <div class="list-container">
      {props.utenti.length === 0 ? (
        <div class="form empty-state">
          <p style="color: var(--text-secondary); font-style: italic; margin: 0;">Nessun utente presente.</p>
        </div>
      ) : (
        props.utenti.map((utente) => (
          <div class="user-stream-block">
            
            {/* Left Side: Profile Sidebar Controls */}
            <div class="user-profile-sidebar">
              <div class="user-info">
                <h3>{utente.name} {utente.lastName}</h3>
                <p class="user-detail"><strong>Username:</strong> {utente.userName || 'N/D'}</p>
                <p class="user-detail"><strong>Email:</strong> {utente.email}</p>
                <p class="user-detail"><strong>Tel:</strong> {utente.phone || 'N/D'}</p>
              </div>

              {/* RENDERIZZA LE AZIONI SOLO SE L'UTENTE COINCIDE CON QUELLO LOGGATO */}
              {props.currentUserId === utente.id && (
                <div class="card-actions">
                  <a href={`/newPost?authorId=${utente.id}`} class="button btn-add-post">
                    Scrivi un Post
                  </a>
                  <a href={`/updateUser/${utente.id}`} class="button btn-update">
                    Modifica Profilo
                  </a>
                  <form action={`/eliminaUtente/${utente.id}`} method="post" style="width: 100%;">
                    <button class="button btn-delete" type="submit">
                      Elimina Utente
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Side: Content Timeline Feed */}
            <div class="user-posts-section">
              <h4 class="posts-section-title">Post Creati ({utente.posts.length})</h4>

              <div class="posts-feed">
                {utente.posts.length === 0 ? (
                  <p class="no-posts-text">Questo utente non ha ancora pubblicato post.</p>
                ) : (
                  utente.posts.map((post) => (
                    <div class="mini-post-card">
                      {post.image && (
                        <div class="post-image-wrapper" >
                          <img
                            src={`/public/uploads/${post.image}`}
                            alt={post.title}
                          />
                        </div>
                      )}
                      <div class="post-content-wrapper">
                        <h5>{post.title}</h5>
                        <p>{post.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default BaseList;