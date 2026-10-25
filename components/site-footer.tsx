export function SiteFooter() {
  return (
    <footer className="footer mt-16">
      <div className="mx-auto grid max-w-[1120px] gap-6 px-5 py-10 sm:grid-cols-2">
        <div>
          <p className="m-0 font-display text-2xl text-fg italic">what hatred breeds you must resist</p>
          <p className="mt-2 mb-0 text-sm">
            <cite className="not-italic">The Crüxshadows</cite>, “Resist”
          </p>
        </div>
        <div className="text-sm leading-relaxed sm:text-right">
          <p className="m-0">
            This site uses Google Analytics (G-13S6Z9KCX9) to count visits. Contact:{" "}
            <a href="mailto:thewhitewitchtm@google.com">thewhitewitchtm@google.com</a>.
          </p>
          <p className="mt-3 mb-0">
            <a href="https://github.com/TheWhiteWitchTM/sociallydead">Source</a>
            {" · "}
            <a href="https://github.com/TheWhiteWitchTM/sociallydead/issues">Suggest a listing</a>
            {" · "}
            GPL-2.0
          </p>
        </div>
      </div>
    </footer>
  );
}
