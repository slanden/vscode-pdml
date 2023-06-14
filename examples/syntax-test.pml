[options]
dadwa
[doc]

sas[root
  [subnode (no-val num=0 sq='1' dq="3\d2" uq=unq dec=-0.99 [- Comment in attrs -] 42 "standalone dquote" 'standalone squote' s=/a/b)]
  [subnode (
    no-value
    number=0
    squote='1'
    dquote="3\d2"
    unquote=unq
    invalid==
    decimal= -0.99
    [- Comment in attrs -]

    tally=[u:get tally]
    42
    "standalone dquote"
    'standalone squote'
    s= /a/b
    path = C:\name\test ok
  )]
  [subnode
    (attr=3)
  ]
  [ns:item]
  [ns:item:item:item (
    name name:spaced:attr)]
  [title Example PDML File]
  [dashed-node]
  [tree
    [branch
      [u:set leaves=1]
      [u:set leaves=1
        more leaves = "green"
      ]
    ]
    "quoted free text"
    free text

    Ignore parens (dwa) that don't immediately follow
    the start of a node.

    Escaped node brackets look better colored like
    other escape characters.
    \[\]
  ]
  [- Comment inside a node -]
]

Top level escaped character \t

Unicode escapes
\u1234not-this
\U12345678not-this

Some [b[i bold italic text]].
[- Top level comment -]
[- Top level [- nested comment -] -]

[- Many -]
[- contiguous -]
[- single-line -]
[- comments -]

[--- Embedded Code ---]

[code
  """
    code {
      background: red;
      /* css comment */
    }
  """
]

[code (lang=css)
  """
    code {
      background: red;
      /* css comment */
    }
  """
]
[code (lang=css) """
  
"""
]

[code (lang=javascript)
  ===
    let msg = "All good";
    function ok(e) {
      return {"ok": msg};
    }
  =====
]

[not-code "="]

[--- OnEnter Rules Test ---]
[attrs
  [attrs (a1=1 a2)]
]
[bold dwa[]]
[code]
[multi
  line]
[code (
  )]

Inline [b[i text]].

[- Utility Nodes -]

[-
  The content of utility nodes should be treated
  like attributes
-]
[u:set color= 'light green']

[u:set
  width=200
  height = 100
]
[u:ins_file path = /path/to/file.txt]

[u:get color]
[u:get height
]
[t:string dasd\wsadasdasd
  dasd\dsadsa\cddsad
]
[t:raw_text (lang=css)
  """
  daw
  """
]

[s:exp 1 + 1]
[s:exp "string".split().join('\n')]
[s:exp "string"
  .split()
  .join('\n')
]
[s:script "string".split().join('\n');]
[s:script (dwa)
  ~~~
  const licenseFile = "resources/license.txt"
  if ( fileUtils.exists ( licenseFile ) ) {
      doc.insert ( fileUtils.readText ( licenseFile ) );
  } else {
      stderr.writeLine ( "WARNING: No license file found!" );
  }
  ~~~
]
[s:def
  ~~~
  const PI = 3.1415926;

  function computeCircumference ( radius ) {
      return 2 * PI * radius;
  }

  function computeArea ( radius ) {
      return PI * radius * radius;
  }
  ~~~
]
