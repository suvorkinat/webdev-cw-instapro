import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { getToken } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale"
import { toggleLike,dislikeLike } from "../api.js";

export function renderPostsPageComponent({ appEl, userView }) {
  // TODO: реализовать рендер постов из api
 // console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  let postsHTML = posts.map((post) => {
  return `<li class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                    <button data-id=${post.id} data-liked="${post.isLiked}" class="like-button">   
                        ${post.isLiked ? `<img src="./assets/images/like-active.svg"></img>` : `<img src="./assets/images/like-not-active.svg"></img>`}
                    </button>
                
                    <p class="post-likes-text">
                        Нравится: <strong>
                            ${post.likes.length === 0 ? 0 : post.likes.length === 1 ? post.likes[0].name
                            : post.likes[post.likes.length - 1].name + ' и еще ' + (post.likes.length - 1)}
                        </strong>
                    </p>
                </div>
                <button data-id=${post.id} class="delete-button"> 
                <p class="delete">Удалить пост</p>
                </button>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                    ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
                    </p>
                  </li>`;
                        }).join("");
                      

                        const appHtml = `
                        <div class="page-container">
                          <div class="header-container"></div>
                          <ul class="posts">
                          ${postsHTML}
                          </ul>
                        </div>`;    

  appEl.innerHTML = appHtml;

  // Delete 
  const deleteButtons = document.querySelectorAll('.delete-button');

for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = deleteButton.dataset.id;
        deletePost(id);
    });
}
  

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

//likes counter

function getLikePost() {
  const likesButtons = document.querySelectorAll('.like-button');
console.log(likesButtons);
  likesButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log('click');

      const id = button.dataset.id; 
    console.log('id', id);// 
      const isLiked = button.dataset.liked;
      console.log('isLiked', isLiked); // Узнаем поставил ли пользователь лайк
      const index = posts.findIndex((post) => post.id === id); 
      console.log('index', index);// Находим индекс поста в массиве posts

      if (index === -1) {
        console.error("Ошибка: пост не найден");
        return;
      }

      if (isLiked === 'false') {
        toggleLike(id, { token: getToken() })
          .then((updatedPost) => {
            //posts[index].likes = updatedPost.post.likes;
            console.log(userView);
            goToPage(userView ? USER_POSTS_PAGE : POSTS_PAGE,{ userId: id});
          })
          .catch((error) => {
            console.error("Ошибка при добавлении лайка:", error);
          });
      } else {
        dislikeLike(id, { token: getToken() })
          .then((updatedPost) => {
            //posts[index].likes = updatedPost.post.likes;
            console.log(userView);
            goToPage(userView ? USER_POSTS_PAGE : POSTS_PAGE, { userId: id});
          })
          .catch((error) => {
            console.error("Ошибка при удалении лайка:", error);
          });
      }
    });
  });
}
  getLikePost();
}