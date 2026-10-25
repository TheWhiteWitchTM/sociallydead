import { asset } from "@/lib/asset";
import { SITE_ORIGIN } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = `${SITE_ORIGIN}/woozle-effect/`;
const pageImage = `${SITE_ORIGIN}/woozle-banner.jpg`;

const description =
  "How the right on X turns a circle of reposts into a source, and why the only way through it is to carry the real thing the same way.";

export const metadata: Metadata = {
  title: "The Woozle effect",
  description,
  keywords: ["Woozle effect", "circular reporting", "X", "misinformation", "citation", "SociallyDead"],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "The Woozle effect — they cited each other. That was the source.",
    description,
    url: pageUrl,
    siteName: "SociallyDead",
    type: "article",
    images: [
      {
        url: pageImage,
        width: 1200,
        height: 630,
        alt: "The Woozle Effect. They cited each other. That was the source. A circle of footprints around a red ember.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Woozle effect — they cited each other. That was the source.",
    description,
    images: [pageImage],
  },
};

export default function WoozlePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Woozle effect",
    description,
    image: pageImage,
    author: { "@type": "Organization", name: "SociallyDead" },
    publisher: { "@type": "Organization", name: "SociallyDead", url: `${SITE_ORIGIN}/` },
    mainEntityOfPage: pageUrl,
    datePublished: "2026-10-25",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <img
        className="page-banner"
        src={asset("/woozle-banner.jpg")}
        alt="The Woozle Effect. They cited each other. That was the source."
        width={1200}
        height={630}
      />
      <article className="essay">
        <p className="kicker">The Woozle effect</p>
        <h1 className="essay-title">They cited each other. That was the source.</h1>
        <p className="essay-deck">
          A field guide to how a circle of reposts on X turns into a fact, and why one correct reply never catches
          it. The tracks multiply because someone is walking them. If you want the true thing to travel, you walk
          too.
        </p>

        <h2>Pooh was the footprint</h2>
        <p>
          In the snow, Pooh and Piglet find tracks. They follow them. The tracks increase. Two animals, then three,
          then a party of woozles, which is a creature that does not exist and is having an excellent day. Christopher
          Robin comes over the hill and points out that they have been walking in circles around a small wood. The
          new tracks are theirs.
        </p>
        <p>
          That is the whole mechanism. Everything after this is the same walk, with quote-posts instead of snow.
        </p>
        <p>
          Beverly Houghton put the grown-up name on it in 1979. She was watching a frightening story about battering
          harden into common knowledge faster than the studies underneath it could hold. She called the pattern the
          Woozle effect. Other people say evidence by citation. Richard Gelles, writing on family violence, credited
          her with the phrase. The academic version is polite about it. A paper cites a paper that cited a sentence
          that was a guess, and after enough laps the guess is wearing a bibliography.
        </p>
        <p>
          On X the bibliography is a row of avatars. Nobody had to open a journal. They opened each other.
        </p>
        <blockquote className="pull">
          Six accounts in agreement are not six sources. They are one conversation with better lighting.
        </blockquote>

        <h2>What the circle is actually doing</h2>
        <p>
          A woozle is not a glitch, and it is not usually a mastermind with a corkboard. It is a social reflex with
          an export button. The right of X is good at it because the right of X already lives in a room together. The
          pundit, the meme page, the county account, the lawyer who is just asking questions, the bio that is a flag
          and a warning. They read each other first. They trust each other first. When one of them says a thing, the
          next one does not experience it as a claim. He experiences it as the room talking.
        </p>
        <p>This is the walk, the way it happens on a Tuesday. Not a theory of propaganda. A sequence.</p>
        <ol className="walk">
          <li>
            <strong>The seed.</strong> Someone posts a claim with the document already cut off. A number with no
            denominator. A screenshot cropped above the date. “I’m hearing.” “A source in the room.” “They don’t want
            you to know.” The post is not a lie you can grab with both hands. It is a hallway. Anyone can stand in
            it.
          </li>
          <li>
            <strong>The first laundering.</strong> A second account quote-posts it and writes “as reported.” Those
            two words do the laundry. The quote-post has a URL and a time, so it looks like a citation if you are
            moving fast, which is the speed the machine is built for. The claim now has a source. The source is a
            person who read the claim.
          </li>
          <li>
            <strong>The ring.</strong> Five or six accounts who already agree post it before lunch. Each one cites a
            different member of the ring, so no two posts look like copies if you only open one. A stranger scrolling
            past sees six outlets. Agreement is the content. The citation is a friendship bracelet that happens to be
            a link.
          </li>
          <li>
            <strong>The upgrade.</strong> A larger account, or an elected official, or someone who books a show,
            posts that “multiple sources” are saying it. The sources are the ring. The ring then quote-posts the
            official. The official is upstream and downstream in the same hour. Pooh has lapped himself and is
            impressed by the size of the animal.
          </li>
          <li>
            <strong>The jpeg.</strong> Someone posts a picture of the quote-posts. Pictures travel farther than
            links, and a picture of a post is harder to correct than the post. The archive is now a jpeg. You cannot
            click through a jpeg to the missing document. That is why it is a jpeg.
          </li>
          <li>
            <strong>The literature.</strong> A newsletter rounds the posts up. The posts update to link the
            newsletter. A blog cites the thread that cites the blog. You now have a literature. It has headings. The
            next literature will cite this one, and nobody in the chain will have time to walk back to the hallway,
            because the hallway was never kept and also it is gone.
          </li>
          <li>
            <strong>The tie.</strong> It leaves the circle. A cable hit. A party graphic. A newspaper sentence that
            says social media reacted, as if social media were a street where independent people stand in the rain.
            The woozle has put on a tie. Arguing with it now feels like arguing with everyone. Everyone, in this
            case, is six accounts and a graphic.
          </li>
        </ol>

        <h2>Why the correction dies on schedule</h2>
        <p>
          The correction is one post, by one person, with the document attached. It often lives in the replies. The
          audience of the original post will not go there. They did not come for the document. The replies belong to
          the people who treat a correction as an intrusion, and your careful paragraph becomes their engagement.
          The algorithm does not have to be cynical. It counts. It shows the claim to a million people and your
          paragraph to your mother.
        </p>
        <p>
          This is the part that makes honest people furious, and then tired, and then quiet. Tired and quiet is the
          favored outcome. A woozle does not have to be believed by everyone. It has to be the thing a person heard
          three times before dinner, so that the document, when it finally arrives, sounds like a technicality.
          There was a lot of smoke. The smoke was the reposts. You are arguing with weather somebody scheduled.
        </p>
        <blockquote className="pull">
          A correction posted once is a diary. The claim, posted twelve times, is the news.
        </blockquote>
        <p>
          Waiting for the platform to notice is a plan only if the plan is to wait. The platform noticed. It counted
          the reposts and called the circle a lively community. A community note, when one shows up, shows up after
          the tie is on. A note is a footnote on a parade.
        </p>
        <p>
          Being more correct in a quieter room is not a plan either. Correctness is not distribution. This directory
          exists because a link that is not repeated is a link that is not there. The other side understood that
          without scheduling a meeting. You are allowed to schedule the meeting.
        </p>

        <h2>Do the same motion. Do not build a second empty center.</h2>
        <p>
          Here is the part people skip so they can stay comfortable.
        </p>
        <p>
          The only way through a circle of footprints is more footprints, pointed at a real door. Not a cleverer lie.
          Not your own hallway. If you invent a counter-claim and pass it around until it hardens, you have built a
          smaller woozle. They are better at woozles than you are. You will dislike the person you have become by
          Thursday, and you will still lose the hallway, because their circle is older and already includes the
          official. They can live in an empty center. It is their weather. It will not be yours.
        </p>
        <p>
          Do the same motion. That is the instruction, and it is not a poetic way of saying become them.
        </p>
        <p>
          Repost the person who did the work. Quote them, name them as the source, and leave the document in the
          post. When three of you cite the same reporter, all three citations point at the reporter, not at each
          other. That is the difference you do not get to blur. Their circle cites the circle. Yours cites the thing,
          and then you carry the thing until carrying it feels repetitive. Repetition is the price. They paid it
          years ago and stopped tasting it.
        </p>
        <p>
          One person posting a thread into the void is keeping a diary. Twelve people who trust each other,
          reposting that thread the same afternoon, with the link still on it, is a desk. A stranger sees the same
          sourced claim three times before dinner and mistakes it for the general sense of things. That mistake,
          aimed at a real document, is the entire game. It is also, inconveniently, how most true stories arrive.
          You did not read the ruling. You read three people who had read the ruling and did not drop the link. Do
          that on purpose.
        </p>
        <p>
          Cite sideways, not only up. The large account is not the strategy. The strategy is the mid-sized desks who
          actually read, handing the same post across so it does not die in one timeline at 11:40. Silence, among
          people who agree, is how a ring pretends to be a solo genius, and how a solo genius stays inaudible.
        </p>
        <p>
          Keep the source in the post. Every hop that drops the link is a hop toward a woozle. If you cannot say
          where it came from in the post itself, you are already walking around the wood, and the tracks behind you
          are starting to look like company.
        </p>
        <p>
          Repeat the correction as if it were the claim. The claim got twelve posts. The correction gets one, and a
          sigh, and a promise to be better about screenshots next time. Give the correction the twelve. It will feel
          undignified. Dignity does not trend. The footprints do. Post it when you see the claim, not only when you
          are angry. Post it again in the afternoon, when the ring is on its third lap and a new audience is
          arriving to a story that, in their timeline, has no past. You are the past. Walk where they can see you.
        </p>
        <p>
          Use this directory as a contact list, not a museum. If a desk published the thing, send people to the
          desk. If you are the desk, say the other desks out loud. Name them in the post. The right does this
          constantly and calls it loyalty. You can call it distribution. The audience cannot tell the difference,
          and for once that is useful.
        </p>
        <p>
          Do not dogpile a person for sport. A pile of insults is also a woozle. It cites itself, it feels like a
          crowd, and it teaches their audience that you came to perform. Arrive with the document. Leave with the
          document still visible. If the post does not contain the source, it is not a counter. It is fan mail to
          their numbers.
        </p>

        <h2>Since “do the same” is easy to nod at</h2>
        <p>When you see the claim, do the unfancy version.</p>
        <ol className="practice">
          <li>
            <strong>Find the earliest post you can, and the document it is pretending to be.</strong> If there is no
            document, say that in those words, and name the earliest post as the source of the smoke.
          </li>
          <li>
            <strong>Write one post that holds the document, or the absence of one, and the name of the person who
            checked.</strong> Not a thread of twelve if the first post can carry it. Threads are where links go to
            be admired and not opened.
          </li>
          <li>
            <strong>Send that post to desks whose readers will actually see a repost.</strong> Not into the replies
            of the largest account in the ring, where you are a costume. Into timelines that do not already hate
            you.
          </li>
          <li>
            <strong>Repost their version too, even if yours was first.</strong> Especially if yours was first. The
            point is the number of doors, not the monogram on the door.
          </li>
          <li>
            <strong>In the afternoon, post it again.</strong> The ring did. The ring will. A correction that works
            banker’s hours loses to a claim that works shifts.
          </li>
          <li>
            <strong>Tomorrow, when the same claim comes back wearing a tie, quote the post that still has the
            document.</strong> Do not start from zero. Zero is how they reset you.
          </li>
        </ol>
        <p>
          None of this is noble. It is manual. It is the job. The other side automated it with friendship and a
          habit of quoting the friend. You may have to use the group chat you have been too proud to make.
        </p>

        <h2>The animal is the walking</h2>
        <p>
          Pooh never found a woozle. He found that he had been following himself, and he had the manners to be
          embarrassed, which is more than you will get from a quote-post at nine in the evening. On X, a circle of
          people found that if enough of them walk behind each other, a crowd will applaud the animal. You will not
          shame them out of the circle. You will not footnote them out of it. A footnote is what a correction looks
          like when it has already lost.
        </p>
        <p>
          You build a louder set of tracks that lead to a real door. You keep the link in your hand while you walk.
          You do it again tomorrow, because they will, and because a true thing said once is, on that platform, a
          true thing that did not happen.
        </p>
        <p>Christopher Robin is not coming over the hill. He is busy. The hill is yours.</p>
        <p className="essay-close">
          <Link href="/#directory">Back to the directory</Link>
          {" · the desks are the contact list."}
        </p>
      </article>
    </>
  );
}
