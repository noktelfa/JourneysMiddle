const emoji = {
	Like: '👍',
	Dislike: '👎',
	Love: '❤',
	Laugh: '😆',
	ROFL: '🤣',
	Surprised: '😲',
	Cry: '😭',
	Angry: '😡',
	Hug: '🧸',
	none: '∅',
};

export function formatReactions (reactions) {

  var tally = [];
  var likes = [];
  var listing = '';
  
  Object.entries(reactions).forEach((reaction) => {
    likes.push(reaction[1].Reaction);
  });
  Object.entries(emoji).forEach(([key, value]) => {
    let count = likes.filter((like) => like == key).length;
    if (count > 0) {
      tally.push([key, count]);
    }
  });
  tally.forEach((react) => {
    listing += emoji[react[0]] + '<sub>' + react[1] + '</sub>&nbsp;';
  });
  if (listing.length === 0) {
    listing = '(react)';
  }
  return listing;
};

export function compileComments (rawComments, rawUsers) {

	if(rawComments.lenth === 0) {
		return;
	}

	const extantUsers = rawUsers.map((user) => user.UserId)

	const userList = {}
	rawUsers.forEach((user) => userList[user.UserId] = user.FirstName + ' ' + user.LastName)

	const comments = rawComments
		.filter((comment) => extantUsers.includes(comment.UserId))
		.map((comment) => `<div class="comment">\n<div class="commentAuthor">${userList[comment.UserId]}</div>\n<div class="commentary">${comment.Comment}</div>\n</div>\n<br />\n`)
		.join('');
	
	return comments;
}