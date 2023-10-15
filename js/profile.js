/* PROFILE INFO */
import renderProfile from "./modules/renderAuthors.mjs";
import { follow } from "./modules/follow.mjs";
import { unfollow } from "./modules/unfollow.mjs";

const url = "https://api.noroff.dev/api/v1/social/profiles/";
const token = localStorage.getItem("token");

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const author = params.get("author");
console.log(author);

async function renderUsers() {
  const res = await fetch(
    url + author + "?_followers=true&_following=true&_posts=true",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log(data);
  document.title = `${author} | The Garden`;
  renderProfile(data);
  getPosts();
}

/* AUTHORS POSTS */
import renderCard from "./modules/renderCard.mjs";

const containerPosts = document.querySelector("#root-posts");
const buttonMorePosts = document.querySelector("#buttonMorePosts");

const postsPerPage = 10;
let startIndex = 0;

async function getPosts() {
  const res = await fetch(
    url + author + "/posts?_author=true&_reactions=true&_comments=true",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const usersPosts = await res.json();
  const slicedPosts = usersPosts.slice(startIndex, startIndex + postsPerPage);
  slicedPosts.forEach((item) => {
    containerPosts.append(renderCard(item));
  });
  if (usersPosts.length <= startIndex + postsPerPage) {
    buttonMorePosts.style.display = "none";
  } else {
    buttonMorePosts.style.display = "flex";
  }
  buttonMorePosts.addEventListener("click", () => {
    startIndex += postsPerPage;
    const nextSlice = usersPosts.slice(startIndex, startIndex + postsPerPage);
    nextSlice.forEach((item) => {
      containerPosts.append(renderCard(item));
    });
    if (usersPosts.length <= startIndex + postsPerPage) {
      buttonMorePosts.style.display = "none";
    }
  });
}
buttonMorePosts.style.display = "none";


/* FOLLOW/UNFOLLOW - method: PUT */
const username = localStorage.getItem("name");
const buttonFUF = document.querySelector("#buttonFUF");

async function getProfile() {
  const res = await fetch(
    url + username + "?_followers=true&_following=true&_posts=true",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const myData = await res.json();
  const myFollowings = myData.following;
  console.log(myFollowings);
  myFollowings.forEach(({ name }) => {
    const item = { name };
    console.log(item.name);
    console.log(author);

    buttonFUF.addEventListener("click", (e) => {
      e.preventDefault();
      if (author !== item.name) {
        follow();
        buttonFUF.classList.add('btn-custom-follow-following');
        buttonFUF.classList.remove('btn-custom-follow-not-following')
      } else {
        unfollow();
        buttonFUF.classList.remove('btn-custom-follow-following');
        buttonFUF.classList.add('btn-custom-follow-not-following')
      }
      location.reload();
    });
  });
}
getProfile();
renderUsers();
