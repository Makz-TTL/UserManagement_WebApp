import { User } from "../db/schema";
import { Post } from "../db/schema/post";

type UserWithPost = User & {
  posts: Post[]
}

type BaseListProps = {
  utenti: UserWithPost[];
  currentUserId?: number | null; 
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

            
            <div class="user-profile-sidebar">
              <div class="user-info">
                <h3>{utente.userName}</h3>
                <p class="user-detail"><strong>Nome:</strong> {utente.name} {utente.lastName}</p>
              </div>


              {props.currentUserId === utente.id && (
                <><p class="user-detail"><strong>Email:</strong> {utente.email}</p><p class="user-detail"><strong>Telefono:</strong> {utente.phone || 'N/D'}</p><div class="card-actions">
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
                  <a href={`/logout`} class="button btn-logout">
                    Logout
                  </a>

                </div></>
              )}
            </div>

      
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

                        {props.currentUserId === utente.id && (
                       <form action={`/eliminaPost/${post.id}`} method="post" style="margin-top: 10px;">
                          <button class="button btn-delete-post" type="submit">
                            🗑️
                          </button>
                        </form>
                        )}
                  
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